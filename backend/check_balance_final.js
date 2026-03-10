import { RpcProvider, Contract, num, hash } from 'starknet';

const provider = new RpcProvider({ nodeUrl: 'https://starknet-sepolia-rpc.publicnode.com' });
const address = '0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904';

const strk = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
const eth = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

async function check() {
    console.log('Checking address:', address);

    // Check if contract exists
    try {
        const nonce = await provider.getNonceForAddress(address);
        console.log('Nonce:', nonce);
    } catch (e) {
        console.log('Account is not deployed (ContractNotFound).');
    }

    const { result: strkRes } = await provider.callContract({
        contractAddress: strk,
        entrypoint: 'balanceOf',
        calldata: [address]
    }).catch(e => ({ result: ['Error: ' + e.message] }));
    console.log('STRK Balance:', strkRes[0]);

    const { result: ethRes } = await provider.callContract({
        contractAddress: eth,
        entrypoint: 'balanceOf',
        calldata: [address]
    }).catch(e => ({ result: ['Error: ' + e.message] }));
    console.log('ETH Balance:', ethRes[0]);
}

check();
