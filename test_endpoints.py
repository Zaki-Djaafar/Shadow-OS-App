import requests

headers = {
    "X-RapidAPI-Key": "404eee3ff2mshfc9693b3f503fa5p149577jsn3e3375718952",
    "X-RapidAPI-Host": "instagram-scraper-stable-api.p.rapidapi.com"
}

paths = [
    "/account_info",
    "/account-info",
    "/api/v1/info",
    "/v1/info",
    "/user_info",
    "/profile_info",
    "/user/info",
    "/profile"
]

params_lists = [
    {"username": "instagram"},
    {"ig": "instagram"},
    {"user": "instagram"},
    {"username_or_id_or_url": "instagram"}
]

print("Testing endpoints...")
success = False
for path in paths:
    for params in params_lists:
        url = f"https://instagram-scraper-stable-api.p.rapidapi.com{path}"
        try:
            r = requests.get(url, headers=headers, params=params)
            if r.status_code != 404:
                print(f"[{r.status_code}] SUCCESS! URL: {url} Params: {params}")
                print(f"Response: {r.text[:500]}")
                success = True
                break
        except Exception as e:
            pass
    if success:
        break

if not success:
    print("All combinations failed! We might need to try a different HTTP Method (POST).")

