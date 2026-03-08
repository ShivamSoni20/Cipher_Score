import json
import urllib.request
import time

def call_rpc(url, method, params):
    data = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": int(time.time())
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=10) as f:
            return json.loads(f.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

address = "0x34c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904"
nodes = [
    "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    "https://starknet-sepolia-rpc.publicnode.com",
    "https://free-rpc.nethermind.io/sepolia-juno/v0_7"
]

for node in nodes:
    print(f"Testing Node: {node}")
    # Try getting class hash at address
    res_class = call_rpc(node, "starknet_getClassHashAt", ["latest", address])
    print(f"  Class Hash: {res_class.get('result', res_class.get('error'))}")
    
    # Try getting balance (using starknet_call for STRK)
    # STRK Address: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
    # entrypoint: balanceOf (selector: 0x2e4263afad30923c891518314c3c95dbe171625eee5a592d2534b82c324b82)
    res_bal = call_rpc(node, "starknet_call", [
        {
            "contract_address": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            "entry_point_selector": "0x02e4263afad30923c891518314c3c95dbe171625eee5a592d2534b82c324b82",
            "calldata": [address]
        },
        "latest"
    ])
    print(f"  STRK Balance Raw: {res_bal.get('result', res_bal.get('error'))}")
