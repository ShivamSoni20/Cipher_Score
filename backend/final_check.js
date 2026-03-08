import { ec, hash, num } from 'starknet';

const privateKey = '0xda5d1e5d9c383e295e2027a46cc25c909da543ae2489a592d73de451b8e789';
const pubKey = ec.starkCurve.getStarkKey(privateKey);
console.log('Stark Public Key:', pubKey);

const address = '0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904';

// Check if address is public key
if (num.toHex(pubKey) === num.toHex(address)) {
    console.log('MATCH: Address is Public Key!');
}

// Common hashes
const hashes = [
    '0x061efe27ea3e30f1d530669145690b84da0a149c71a39d892095cc1663162232',
    '0x04d07e40e93398ed3c76981e72993225faf864ec23b64d816c288d04f998bcad',
    '0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f'
];

for (const ch of hashes) {
    const computed = hash.calculateContractAddressFromHash(pubKey, ch, [pubKey], 0);
    if (num.toHex(computed) === num.toHex(address)) {
        console.log('MATCH FOUND with Standard Pattern:', ch);
    }
    const computed2 = hash.calculateContractAddressFromHash(pubKey, ch, [pubKey, 0], 0);
    if (num.toHex(computed2) === num.toHex(address)) {
        console.log('MATCH FOUND with Braavos/Argent Pattern:', ch);
    }
}
