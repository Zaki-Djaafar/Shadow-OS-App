import re
import requests

def test_sources():
    sources = [
        ("https://www.sslproxies.org/", r'>(\d{1,3}(?:\.\d{1,3}){3})<.+?>(\d+)<'),
        ("https://free-proxy-list.net/", r'>(\d{1,3}(?:\.\d{1,3}){3})<.+?>(\d+)<'),
        ("https://spys.me/proxy.txt", r'(\d{1,3}(?:\.\d{1,3}){3}):(\d+)')
    ]
    
    proxies = set()
    for url, pattern in sources:
        try:
            r = requests.get(url, timeout=3)
            matches = re.findall(pattern, r.text)
            for ip, port in matches:
                proxies.add(f"http://{ip}:{port}")
            print(f"Success on {url}: found {len(matches)} proxies")
        except Exception as e:
            print(f"Failure on {url}: {e}")
            
    print(f"Total unique proxies: {len(proxies)}")

test_sources()
