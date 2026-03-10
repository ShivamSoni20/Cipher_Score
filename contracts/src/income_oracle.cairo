// ============================================================
// CIPHER SCORE — ZK Income Oracle
// Privacy-preserving creditworthiness for Starknet DeFi
// "Prove income. Get approved. Nothing revealed."
// Starknet Re{define} Hackathon 2026 — Privacy Track
// ============================================================

use starknet::ContractAddress;

#[starknet::interface]
pub trait IIncomeOracle<TContractState> {
    fn register_commitment(
        ref self: TContractState,
        commitment:  felt252,
        nullifier:   felt252,
        proof_valid: bool,
        qualifies:   bool
    );

    fn verify_income(
        ref self: TContractState,
        user_address: ContractAddress,
        threshold:    u64,
        commitment:   felt252,
        nullifier:    felt252
    ) -> bool;

    fn get_commitment(
        self: @TContractState,
        address: ContractAddress
    ) -> felt252;
    
    fn is_nullifier_used(
        self: @TContractState,
        nullifier: felt252
    ) -> bool;
    
    fn get_commit_timestamp(
        self: @TContractState,
        commitment: felt252
    ) -> u64;
    
    fn get_total_proofs(self: @TContractState) -> u64;
    fn get_total_verifications(self: @TContractState) -> u64;
    fn get_income_qualifies(
        self: @TContractState,
        address: ContractAddress
    ) -> bool;
}

#[starknet::contract]
mod IncomeOracle {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,
        StorageMapReadAccess, StorageMapWriteAccess, Map
    };

    #[storage]
    struct Storage {
        commitments:             Map<ContractAddress, felt252>,
        commit_timestamps:       Map<felt252, u64>,
        used_nullifiers:         Map<felt252, bool>,
        income_qualifies:        Map<ContractAddress, bool>,
        total_proofs_registered: u64,
        total_verifications:     u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CommitmentRegistered: CommitmentRegistered,
        IncomeVerified:       IncomeVerified,
    }

    #[derive(Drop, starknet::Event)]
    pub struct CommitmentRegistered {
        #[key]
        pub user:       ContractAddress,
        pub commitment: felt252,
        pub timestamp:  u64,
        pub qualifies:  bool,
    }

    #[derive(Drop, starknet::Event)]
    pub struct IncomeVerified {
        #[key]
        pub protocol:  ContractAddress,
        #[key]
        pub user:      ContractAddress,
        pub result:    bool,
        pub threshold: u64,
        pub nullifier: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.total_proofs_registered.write(0_u64);
        self.total_verifications.write(0_u64);
    }

    #[abi(embed_v0)]
    impl IncomeOracleImpl of super::IIncomeOracle<ContractState> {

        fn register_commitment(
            ref self: ContractState,
            commitment:  felt252,
            nullifier:   felt252,
            proof_valid: bool,
            qualifies:   bool
        ) {
            assert!(proof_valid, "Invalid ZK proof");
            assert!(commitment != 0, "Empty commitment");

            let caller    = get_caller_address();
            let timestamp = get_block_timestamp();

            self.commitments.write(caller, commitment);
            self.commit_timestamps.write(commitment, timestamp);
            self.income_qualifies.write(caller, qualifies);

            let count = self.total_proofs_registered.read();
            self.total_proofs_registered.write(count + 1_u64);

            self.emit(CommitmentRegistered {
                user: caller,
                commitment,
                timestamp,
                qualifies,
            });
        }

        fn verify_income(
            ref self: ContractState,
            user_address: ContractAddress,
            threshold:    u64,
            commitment:   felt252,
            nullifier:    felt252
        ) -> bool {
            assert!(
                !self.used_nullifiers.read(nullifier),
                "Nullifier already used"
            );

            let stored_commitment = self.commitments.read(user_address);
            assert!(stored_commitment != 0, "No commitment registered");
            assert!(stored_commitment == commitment, "Commitment mismatch");

            let registered_at = self.commit_timestamps.read(commitment);
            let now           = get_block_timestamp();
            assert!(registered_at != 0_u64, "Commitment timestamp missing");
            assert!(now >= registered_at,   "Invalid block timestamp");
            assert!(
                now - registered_at < 2592000_u64,
                "Commitment expired"
            );

            self.used_nullifiers.write(nullifier, true);

            let count = self.total_verifications.read();
            self.total_verifications.write(count + 1_u64);

            let qualifies = self.income_qualifies.read(user_address);
            let protocol  = get_caller_address();

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

        fn get_total_verifications(self: @ContractState) -> u64 {
            self.total_verifications.read()
        }

        fn get_income_qualifies(
            self: @ContractState,
            address: ContractAddress
        ) -> bool {
            self.income_qualifies.read(address)
        }
    }
}
