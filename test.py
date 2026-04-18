import re
import requests

def get_free_proxies():
    try:
        r = requests.get('https://www.sslproxies.org/', timeout=5)
        # Search for typical IP</td><td>PORT structure.
        # Sometimes there's whitespace or newlines, so we use \s*
        matches = re.findall(r'>(\d{1,3}(?:\.\d{1,3}){3})<.+?>(\d+)<', r.text)
        return [f"http://{ip}:{port}" for ip, port in matches]
    except Exception as e:
        print("Proxy fetch failed:", e)
        return []

px = get_free_proxies()
print(f"Found {len(px)} proxies")
print(px[:5])
