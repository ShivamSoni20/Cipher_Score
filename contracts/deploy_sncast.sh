#!/bin/bash
export PATH=$HOME/.local/bin:$HOME/.local/share/scarb-install/2.9.2/bin:$PATH
echo "PATH is: $PATH"
which scarb
cd /mnt/d/Gihtub\ Main/zk-credit-bridge/contracts
~/.local/bin/sncast --account zk_deploy_v2 declare --url https://starknet-sepolia-rpc.publicnode.com --contract-name IncomeOracle
