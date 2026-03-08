import json
import urllib.request

def check_balance(address, token_address, node_url):
    data = {
        "jsonrpc": "2.0",
        "method": "starknet_call",
        "params": [
            {
                "contract_address": token_address,
                "entry_point_selector": "0x02e4263afad30923c891518314c3c95dbe171625eee5a592d2534b82c324b82",
                "calldata": [address]
            },
            "latest"
        ],
        "id": 1
    }
    
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
    }
    
    req = urllib.request.Request(node_url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as f:
            res = json.loads(f.read().decode('utf-8'))
            if 'result' in res:
                return int(res['result'][0], 16) / 10**18
            else:
                return f"Error: {res}"
    except Exception as e:
        return f"Request failed: {e}"

address = "0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904"
strk = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
eth = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"

nodes = [
    "https://starknet-sepolia-rpc.publicnode.com",
    "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    "https://free-rpc.nethermind.io/sepolia-juno/v0_7"
]

for node in nodes:
    print(f"Node: {node}")
    print(f"  STRK Balance: {check_balance(address, strk, node)}")
    print(f"  ETH Balance: {check_balance(address, eth, node)}")
