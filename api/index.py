import os
import requests
import re
import instaloader
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def call_gemini(prompt):
    api_key = os.environ.get("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    try:
        response = requests.post(url, json=payload)
        res_data = response.json()
        if response.status_code == 200:
            return res_data['candidates'][0]['content']['parts'][0]['text'], 200
        elif response.status_code == 429 or response.status_code == 503 or "quota" in str(res_data).lower() or "overloaded" in str(res_data).lower():
            return "SYSTEM OVERLOAD: AI Core is experiencing high demand. Please wait 10 seconds and retry.", 429
        else:
            error_msg = res_data.get('error', {}).get('message', 'Unknown Error')
            return f"Google Error: {error_msg}", response.status_code
    except Exception as e:
        return f"System Error: {str(e)}", 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    user_input = request.json.get('content', '')
    result, status = call_gemini(user_input)
    return jsonify({"result": result}), status if status != 200 else 200

@app.route('/api/synthesize', methods=['POST'])
def synthesize():
    niche = request.json.get('niche', '')
    raw_content = request.json.get('rawContent', '')
    followers = request.json.get('followers', 'Unknown')
    
    prompt = f"""
        Do NOT repeat the input data. You are a High-Level Growth Strategist. 
        Analyze the following Instagram profile and provide 3 unique, high-ticket digital product ideas.
        Be specific to the niche.
        
        Profile Stats:
        Followers: {followers}
        Niche/Bio Context: {niche}
        Raw Content/Ideas: {raw_content}
        
        Output Structure:
        1. Product Title (High Impact)
        2. Module Breakdown (3-5 Modules)
        3. Lesson List for each Module
        4. Bonus Materials (PDFs, Templates)
        
        Tone: Professional, High-Value, structured.
    """
    result, status = call_gemini(prompt)
    return jsonify({"result": result}), status if status != 200 else 200

@app.route('/api/manychat', methods=['POST'])
def manychat():
    product = request.json.get('product', '')
    
    prompt = f"""
        Act as an expert ManyChat Automation Architect.
        Generate a text-based setup for a ManyChat direct response flow based on this product breakdown:
        {product}
        
        STRICT OUTPUT FORMAT REQUIRED (Copy-Pasteable):
        [ TRIGGER ] -> User comments specific keyword on IG Reel
        [ MESSAGE 1 ] -> (The exact DM text sent immediately)
        [ DELAY ] -> XX minutes
        [ MESSAGE 2 / CHECK ] -> (Follow-up if no click)
        [ LINK ] -> (Placeholder for checkout/Whop link)
        
        Keep it purely technical, hacker-like, minimalist, and actionable. Do not add conversational fluff.
    """
    result, status = call_gemini(prompt)
    return jsonify({"result": result}), status if status != 200 else 200



import random
import time

def get_stealth_instaloader():
    L = instaloader.Instaloader(quiet=True, dirname_pattern="", filename_pattern="", request_timeout=10.0)
    
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0"
    ]
    
    L.context._session.headers.update({
        "User-Agent": random.choice(user_agents),
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.instagram.com/",
        "X-IG-App-ID": "936619743392459",
        "Sec-Ch-Ua": '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    })
    
    proxy_url = os.environ.get("PROXY_URL")
    if proxy_url:
        L.context._session.proxies = {"http": proxy_url, "https": proxy_url}
        
    return L

@app.route('/api/fetch-ig-profile', methods=['POST'])
def fetch_ig_profile():
    url_or_username = request.json.get('url', '').strip()
    if not url_or_username:
        return jsonify({"success": False, "error": "No username or URL provided."}), 400
        
    username = url_or_username
    if "instagram.com" in username:
        parts = username.split("instagram.com/")
        if len(parts) > 1:
            username = parts[1].split("/")[0].split("?")[0]
            
    session_id = os.environ.get("INSTAGRAM_SESSION_ID")
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            L = get_stealth_instaloader()
            if session_id:
                L.context._session.cookies.set("sessionid", session_id, domain=".instagram.com")
            
            profile = instaloader.Profile.from_username(L.context, username)
            
            return jsonify({
                "success": True,
                "followers": profile.followers,
                "bio": profile.biography,
                "proxy_used": "PROXY_URL" if os.environ.get("PROXY_URL") else "direct"
            }), 200
            
        except instaloader.exceptions.ProfileNotExistsException:
            return jsonify({"success": False, "error": "Profile not found."}), 404
        except Exception as e:
            error_str = str(e).lower()
            if "403" in error_str or "429" in error_str or "json" in error_str:
                if attempt < max_retries - 1:
                    sleep_time = random.uniform(5, 10)
                    print(f"[WARNING] Rate limit/Block hit (403/429). Retrying in {sleep_time:.2f}s...")
                    time.sleep(sleep_time)
                    continue
            return jsonify({"success": False, "error": f"Scrape Failed: {str(e)}"}), 500
            
    return jsonify({"success": False, "error": "Max retries exceeded. IP blocked."}), 500
