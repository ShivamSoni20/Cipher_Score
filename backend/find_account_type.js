import { ec, hash, num } from 'starknet';

const privateKey = '0xda5d1e5d9c383e295e2027a46cc25c909da543ae2489a592d73de451b8e789';
const publicKey = ec.starkCurve.getStarkKey(privateKey);
console.log('Stark Public Key:', publicKey);

const expectedAddress = '0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904';

// Common class hashes on Sepolia (including the one from search)
const classHashes = [
    '0x061efe27ea3e30f1d530669145690b84da0a149c71a39d892095cc1663162232', // OZ v0.7.0
    '0x04d07e40e93398ed3c76981e72993225faf864ec23b64d816c288d04f998bcad', // OZ v0.8.0
    '0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f', // Argent X
    '0x03131103324a135706222b2e272b22b27a66271a527aff2c34ce1083ec6e1526', // Braavos
    '0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904'  // The user's string itself as a class hash
];

const patterns = [
    (pk) => [pk],
    (pk) => [pk, 0],
    (pk) => [pk, 1]
];

const salts = [
    publicKey,
    num.toHex(0),
    num.toHex(1),
    num.toHex(num.toBigInt(publicKey) ^ BigInt(1)) // common variation
];

for (const ch of classHashes) {
    for (const getCalldata of patterns) {
        const calldata = getCalldata(publicKey);
        for (const salt of salts) {
            const computedAddress = hash.calculateContractAddressFromHash(
                salt,
                ch,
                calldata,
                0
            );
            if (num.toHex(computedAddress).toLowerCase() === num.toHex(expectedAddress).toLowerCase()) {
                console.log('MATCH FOUND!');
                console.log('Class Hash:', ch);
                console.log('Salt:', salt);
                console.log('Calldata:', calldata);
                process.exit(0);
            }
        }
    }
}
console.log('No match found.');
