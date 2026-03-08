use starknet::ContractAddress;

#[starknet::interface]
pub trait IIncomeOracle<TContractState> {
    // Called by borrower: registers their ZK income commitment on-chain
    fn register_commitment(
        ref self: TContractState,
        commitment: felt252,
        nullifier: felt252,
        proof_valid: bool
    );

    // Called by lending protocol: queries if address meets income threshold
    // Returns true/false — no raw data ever
    fn verify_income(
        ref self: TContractState,
        user_address: ContractAddress,
        threshold: u64,
        commitment: felt252,
        nullifier: felt252,
        qualifies: bool
    ) -> bool;

    // Read functions
    fn get_commitment(self: @TContractState, address: ContractAddress) -> felt252;
    fn is_nullifier_used(self: @TContractState, nullifier: felt252) -> bool;
    fn get_commit_timestamp(self: @TContractState, commitment: felt252) -> u64;
    fn get_total_proofs(self: @TContractState) -> u64;
}

#[starknet::contract]
mod IncomeOracle {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess, StorageMapWriteAccess, Map
    };

    // ── STORAGE ──────────────────────────────────────────────────────────────
    #[storage]
    struct Storage {
        // address → their latest commitment hash
        commitments: Map<ContractAddress, felt252>,
        // commitment → when it was registered (for 30-day expiry)
        commit_timestamps: Map<felt252, u64>,
        // nullifier → bool (prevents proof replay across protocols)
        used_nullifiers: Map<felt252, bool>,
        // stats
        total_proofs_registered: u64,
        total_verifications: u64,
    }

    // ── EVENTS ───────────────────────────────────────────────────────────────
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CommitmentRegistered: CommitmentRegistered,
        IncomeVerified: IncomeVerified,
    }

    #[derive(Drop, starknet::Event)]
    pub struct CommitmentRegistered {
        #[key]
        pub user: ContractAddress,
        pub commitment: felt252,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct IncomeVerified {
        #[key]
        pub protocol: ContractAddress,
        #[key]
        pub user: ContractAddress,
        pub result: bool,
        pub threshold: u64,
        pub nullifier: felt252,
    }

    // ── CONSTRUCTOR ──────────────────────────────────────────────────────────
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.total_proofs_registered.write(0);
        self.total_verifications.write(0);
    }

    // ── IMPLEMENTATION ───────────────────────────────────────────────────────
    #[abi(embed_v0)]
    impl IncomeOracleImpl of super::IIncomeOracle<ContractState> {

        fn register_commitment(
            ref self: ContractState,
            commitment: felt252,
            nullifier: felt252,
            proof_valid: bool
        ) {
            // In MVP: proof_valid is passed by frontend after client-side verify
            // Production: call income_verifier::verify() directly here
            assert(proof_valid, 'Invalid ZK proof');
            assert(commitment != 0, 'Empty commitment');

            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Store commitment for this address
            self.commitments.write(caller, commitment);
            self.commit_timestamps.write(commitment, timestamp);

            // Increment counter
            let count = self.total_proofs_registered.read();
            self.total_proofs_registered.write(count + 1);

            // Emit event (visible on Starkscan — key demo moment)
            self.emit(CommitmentRegistered {
                user: caller,
                commitment,
                timestamp,
            });
        }

        fn verify_income(
            ref self: ContractState,
            user_address: ContractAddress,
            threshold: u64,
            commitment: felt252,
            nullifier: felt252,
            qualifies: bool
        ) -> bool {
            // 1. Nullifier must not be used (prevents replay attacks)
            assert(!self.used_nullifiers.read(nullifier), 'Nullifier already used');

            // 2. Commitment must match what user registered
            let stored_commitment = self.commitments.read(user_address);
            assert(stored_commitment == commitment, 'Commitment mismatch');
            assert(stored_commitment != 0, 'No commitment registered');

            // 3. Commitment must be fresh (30 days = 2,592,000 seconds)
            let registered_at = self.commit_timestamps.read(commitment);
            let now = get_block_timestamp();
            assert(now - registered_at < 2592000, 'Commitment expired');

            // 4. Mark nullifier used (one query per protocol)
            self.used_nullifiers.write(nullifier, true);

            // 5. Update stats
            let verif_count = self.total_verifications.read();
            self.total_verifications.write(verif_count + 1);

            // 6. Emit event (protocol address = caller)
            let protocol = get_caller_address();
            self.emit(IncomeVerified {
                protocol,
                user: user_address,
                result: qualifies,
                threshold,
                nullifier,
            });

            qualifies
        }

        fn get_commitment(
            self: @ContractState,
            address: ContractAddress
        ) -> felt252 {
            self.commitments.read(address)
        }

        fn is_nullifier_used(
            self: @ContractState,
            nullifier: felt252
        ) -> bool {
            self.used_nullifiers.read(nullifier)
        }

        fn get_commit_timestamp(
            self: @ContractState,
            commitment: felt252
        ) -> u64 {
            self.commit_timestamps.read(commitment)
        }

        fn get_total_proofs(self: @ContractState) -> u64 {
            self.total_proofs_registered.read()
        }
    }
}
