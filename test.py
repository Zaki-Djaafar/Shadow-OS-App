import requests

headers = {
	"X-RapidAPI-Key": "404eee3ff2mshfc9693b3f503fa5p149577jsn3e3375718952",
	"X-RapidAPI-Host": "instagram-scraper-stable-api.p.rapidapi.com"
}

endpoints = [
    "https://instagram-scraper-stable-api.p.rapidapi.com/v1/users/instagram/info",
    "https://instagram-scraper-stable-api.p.rapidapi.com/v1/users/instagram",
    "https://instagram-scraper-stable-api.p.rapidapi.com/api/v1/users/instagram",
    "https://instagram-scraper-stable-api.p.rapidapi.com/usernameinfo/instagram",
    "https://instagram-scraper-stable-api.p.rapidapi.com/user/instagram",
    "https://instagram-scraper-stable-api.p.rapidapi.com/profile/instagram",
    "https://instagram-scraper-stable-api.p.rapidapi.com/"
]

for url in endpoints:
    try:
        response = requests.get(url, headers=headers)
        print(url, response.status_code)
    except:
        pass
