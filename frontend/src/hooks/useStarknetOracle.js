import { useContract, useSendTransaction } from '@starknet-react/core';
import { CONFIG } from '../config';

// ABI for the deployed IncomeOracle contract
const ORACLE_ABI = [
    {
        type: 'function',
        name: 'register_commitment',
        inputs: [
            { name: 'commitment', type: 'core::felt252' },
            { name: 'nullifier', type: 'core::felt252' },
            { name: 'proof_valid', type: 'core::bool' }
        ],
        outputs: [],
        state_mutability: 'external'
    },
    {
        type: 'function',
        name: 'get_commitment',
        inputs: [
            { name: 'address', type: 'core::starknet::contract_address::ContractAddress' }
        ],
        outputs: [{ type: 'core::felt252' }],
        state_mutability: 'view'
    },
    {
        type: 'function',
        name: 'get_total_proofs',
        inputs: [],
        outputs: [{ type: 'core::integer::u64' }],
        state_mutability: 'view'
    }
];

export function useStarknetOracle() {
    const { contract } = useContract({
        abi: ORACLE_ABI,
        address: CONFIG.ORACLE_ADDRESS,
    });

    const { sendAsync, isPending, data: txData } = useSendTransaction({});

    const registerCommitment = async (commitment, nullifier) => {
        if (!contract) throw new Error('Oracle contract not initialized');

        const call = contract.populate('register_commitment', [
            commitment,  // felt252
            nullifier,   // felt252
            true         // proof_valid: bool
        ]);

        const result = await sendAsync([call]);
        return {
            transaction_hash: result.transaction_hash,
            starkscan_url: `${CONFIG.STARKSCAN_BASE}/tx/${result.transaction_hash}`
        };
    };

    return {
        registerCommitment,
        isPending,
        txData,
        contractAddress: CONFIG.ORACLE_ADDRESS,
    };
}
