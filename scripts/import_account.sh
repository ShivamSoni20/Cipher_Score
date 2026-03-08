#!/bin/bash
# Script to write clean account JSON for sncast 0.48.0 in WSL

ACCOUNT_NAME="shivam_deployer"
ADDRESS="0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904"
PRIVATE_KEY="0xda5d1e5d9c383e295e2027a46cc25c909da543ae2489a592d73de451b8e789"
ACCOUNTS_FILE="$HOME/.starknet_accounts/starknet_open_zeppelin_accounts.json"

mkdir -p "$(dirname "$ACCOUNTS_FILE")"

# Write exact JSON structure
cat <<EOF > "$ACCOUNTS_FILE"
{
  "alpha-sepolia": {
    "$ACCOUNT_NAME": {
      "address": "$ADDRESS",
      "private_key": "$PRIVATE_KEY",
      "type": "open_zeppelin"
    }
  }
}
EOF

echo "✅ Cleanly wrote account '$ACCOUNT_NAME' to '$ACCOUNTS_FILE'."
