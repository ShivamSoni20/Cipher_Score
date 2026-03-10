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
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as f:
            return json.loads(f.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

address = "0x0034c761a7226f0e2684b85b58a32885c977829a72cf5a0d326a3bfce6ea7904"
tokens = {
    "ETH": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    "STRK": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
}
nodes = [
    "https://starknet-sepolia-rpc.publicnode.com",
    "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    "https://free-rpc.nethermind.io/sepolia-juno/v0_7"
]

print(f"Checking address: {address}")
for node in nodes:
    print(f"\nNode: {node}")
    for name, token in tokens.items():
        res = call_rpc(node, "starknet_call", [
            {
                "contract_address": token,
                "entry_point_selector": "0x02e4263afad30923c891518314c3c95dbe171625eee5a592d2534b82c324b82",
                "calldata": [address]
            },
            "latest"
        ])
        if 'result' in res:
            balance = int(res['result'][0], 16) / 10**18
            print(f"  {name} Balance: {balance:.6f}")
        else:
            print(f"  {name} Error: {res.get('error', 'Unknown error')}")
