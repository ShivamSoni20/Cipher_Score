import { RpcProvider, Contract, num } from 'starknet';

const provider = new RpcProvider({ nodeUrl: 'https://starknet-sepolia-rpc.publicnode.com' });
const address = '0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904';
const strkAddress = '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

async function check() {
    try {
        const { result } = await provider.callContract({
            contractAddress: strkAddress,
            entrypoint: 'balanceOf',
            calldata: [address]
        });
        console.log('STRK Balance (raw):', result[0]);
    } catch (e) {
        console.error('Error checking balance:', e.message);
    }
}

check();
