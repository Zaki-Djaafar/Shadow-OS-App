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
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={api_key}"
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
    
    prompt = f"""
        Act as the "Shadow OS" Product Synthesizer.
        Take the following raw fitness content and structure it into a high-value digital product for the 'Whop' platform.
        
        Niche: {niche}
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

GLOBAL_PROXY_CACHE = []

def init_proxies():
    global GLOBAL_PROXY_CACHE
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
        except Exception as e:
            print(f"[ERROR] Failed to fetch proxies from {url}: {e}")
            
    GLOBAL_PROXY_CACHE = list(proxies)
    print(f"[BOOT] Proxy Pre-fetch initialized: {len(GLOBAL_PROXY_CACHE)} active nodes.")

# Vercel Cold-Start Execute
init_proxies()

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
    if session_id:
        try:
            L = instaloader.Instaloader(quiet=True, dirname_pattern="", filename_pattern="", request_timeout=1.2)
            L.context._session.cookies.set("sessionid", session_id, domain=".instagram.com")
            print("[DEBUG] Attempting connection via Session ID.")
            profile = instaloader.Profile.from_username(L.context, username)
            
            return jsonify({
                "success": True,
                "followers": profile.followers,
                "bio": profile.biography,
                "proxy_used": "session"
            }), 200
        except instaloader.exceptions.ProfileNotExistsException:
            return jsonify({"success": False, "error": "Profile not found."}), 404
        except Exception as e:
            print(f"[DEBUG] Session ID failed: {str(e)}. Falling back to proxy rotation...")

    global GLOBAL_PROXY_CACHE
    if not GLOBAL_PROXY_CACHE:
        init_proxies()
        
    proxies = GLOBAL_PROXY_CACHE.copy()
    import random
    random.shuffle(proxies)
    
    # Fallback to direct connection if proxy list collapses
    if not proxies:
        proxies = [None]
    else:
        # 1.2s timeout allows roughly 8 attempts in 10s window on Vercel
        proxies = proxies[:8]
        
    for idx, proxy in enumerate(proxies):
        try:
            L = instaloader.Instaloader(quiet=True, dirname_pattern="", filename_pattern="", request_timeout=1.2)
            
            if proxy:
                print(f"[DEBUG] Attempt {idx+1}: Routing via Proxy {proxy}")
                L.context._session.proxies = {"http": proxy, "https": proxy}
            else:
                print(f"[DEBUG] Attempt {idx+1}: Proceeding Direct Connection")
                
            profile = instaloader.Profile.from_username(L.context, username)
            
            return jsonify({
                "success": True,
                "followers": profile.followers,
                "bio": profile.biography,
                "proxy_used": proxy or "direct"
            }), 200
            
        except instaloader.exceptions.ProfileNotExistsException:
            # Fatal error, target doesn't exist, stop rotating immediately.
            return jsonify({"success": False, "error": "Profile not found."}), 404
        except Exception as e:
            print(f"[DEBUG] Proxy {proxy} bounced/failed: {str(e)}")
            continue
            
    return jsonify({"success": False, "error": "All available proxy networks blocked or timed out."}), 500
