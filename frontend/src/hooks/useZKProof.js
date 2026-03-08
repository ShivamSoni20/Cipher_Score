import { useState, useCallback } from 'react';
import { Noir } from '@noir-lang/noir_js';
import { UltraHonkBackend } from '@aztec/bb.js';
import { CONFIG } from '../config';

export function useZKProof() {
    const [status, setStatus] = useState('idle');
    // States: idle → scanning → proving → submitting → complete → error
    const [proofData, setProofData] = useState(null);
    const [error, setError] = useState(null);
    const [timings, setTimings] = useState({});

    const generateProof = useCallback(async (walletAddress, threshold = CONFIG.INCOME_THRESHOLD_CENTS) => {
        try {
            setError(null);

            // ── PHASE 1: Scan wallet history ──────────────────────────────────────
            setStatus('scanning');
            const t0 = performance.now();

            const scanRes = await fetch(`${CONFIG.BACKEND_URL}/api/wallet/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: walletAddress })
            });

            if (!scanRes.ok) throw new Error('Wallet scan failed');
            const walletData = await scanRes.json();

            setTimings(t => ({ ...t, scan: Math.round(performance.now() - t0) }));

            // ── PHASE 2: Load circuit from backend ───────────────────────────────
            const circuitRes = await fetch(`${CONFIG.BACKEND_URL}/api/circuit`);
            if (!circuitRes.ok) throw new Error('Circuit not available — run compile_circuit.sh first');
            const circuit = await circuitRes.json();

            // ── PHASE 3: Generate ZK proof client-side ───────────────────────────
            setStatus('proving');
            const t1 = performance.now();

            // Generate random secret (stays in browser memory, never sent anywhere)
            const secret = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString();

            // Parse protocol address as Field
            const protocolAddrField = BigInt(CONFIG.ORACLE_ADDRESS || '0x1234').toString();

            // Initialize Noir + Barretenberg backend
            const noir = new Noir(circuit);
            const backend = new UltraHonkBackend(circuit.bytecode);

            // Generate witness from inputs
            const { witness } = await noir.execute({
                income_90d: walletData.income_90d_cents.toString(),
                secret: secret,
                threshold: threshold.toString(),
                protocol_addr: protocolAddrField,
            });

            // Generate the UltraHonk proof
            const { proof, publicInputs } = await backend.generateProof(witness);

            const proofTime = Math.round(performance.now() - t1);
            setTimings(t => ({ ...t, proof: proofTime }));

            // ── PHASE 4: Extract public outputs ──────────────────────────────────
            // publicInputs = [qualifies (bool), commitment (Field), nullifier (Field)]
            const qualifies = publicInputs[0] === '0x01' || publicInputs[0] === '1';
            const commitment = publicInputs[1];
            const nullifier = publicInputs[2];

            // ── PHASE 5: Verify proof locally before submitting ──────────────────
            const isValid = await backend.verifyProof({ proof, publicInputs });
            if (!isValid) throw new Error('Proof verification failed locally');

            const result = {
                // Proof data for on-chain submission
                proof: Array.from(proof),
                publicInputs,
                qualifies,
                commitment,
                nullifier,
                threshold,

                // Display data (no exact income amount)
                income_range: walletData.income_range_display,
                wallet_address: walletAddress,
                proof_time_ms: proofTime,

                // Oracle calldata ready for starknet-react
                calldata: {
                    commitment: commitment,
                    nullifier: nullifier,
                    proof_valid: isValid ? '0x1' : '0x0',
                }
            };

            setProofData(result);
            setStatus('complete');
            return result;

        } catch (err) {
            console.error('ZK proof generation failed:', err);
            setError(err.message);
            setStatus('error');
            throw err;
        }
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setProofData(null);
        setError(null);
        setTimings({});
    }, []);

    return {
        status,
        proofData,
        error,
        timings,
        generateProof,
        reset,
        isLoading: ['scanning', 'proving', 'submitting'].includes(status)
    };
}
