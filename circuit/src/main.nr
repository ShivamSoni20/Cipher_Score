fn main(
    income_90d: u64,          // PRIVATE: total inflows last 90 days (in USD cents)
    secret: Field,            // PRIVATE: random salt / privacy of commitment
    threshold: pub u64,       // PUBLIC: minimum income required (in USD cents)
    protocol_addr: pub Field  // PUBLIC: address of querying protocol (for nullifier)
) -> pub (bool, Field, Field) {

    // 1. Check income meets threshold
    let qualifies: bool = income_90d >= threshold;

    // 2. Build commitment - hides exact income, ties to secret
    //    Uses Poseidon hash (ZK-friendly, Starknet-native)
    let commitment: Field = std::hash::poseidon::bn254::hash_2(
        [income_90d as Field, secret]
    );

    // 3. Build nullifier - per-protocol, prevents proof reuse
    let nullifier: Field = std::hash::poseidon::bn254::hash_2(
        [commitment, protocol_addr]
    );

    (qualifies, commitment, nullifier)
}
