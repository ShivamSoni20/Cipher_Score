import json
import urllib.request
import time

def call_rpc(method, params):
    url = "https://starknet-sepolia-rpc.publicnode.com"
    data = {"jsonrpc": "2.0", "method": method, "params": params, "id": int(time.time())}
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as f:
        return json.loads(f.read().decode('utf-8'))

address = "0x01d9ecc8606d69ec14d6b7a5fc5990e5f907db54052a11df8c3b186f614df328"
strk = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"

res = call_rpc("starknet_call", [
    {"contract_address": strk, "entry_point_selector": "0x02e4263afad30923c891518314c3c95dbe171625eee5a592d2534b82c324b82", "calldata": [address]},
    "latest"
])
if 'result' in res:
    balance = int(res['result'][0], 16) / 10**18
    print(f"STRK Balance: {balance}")
else:
    print(f"Error: {res}")
