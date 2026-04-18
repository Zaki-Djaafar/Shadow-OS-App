import os
import requests
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
            
    try:
        rapidapi_key = os.environ.get("RAPIDAPI_KEY")
        if not rapidapi_key:
            return jsonify({"success": False, "error": "RAPIDAPI_KEY environment variable is not configured on Vercel."}), 500
            
        # Add the exact endpoint requested
        url = "https://instagram-scraper-stable-api.p.rapidapi.com/account_info"
        querystring = {"username": username}
        headers = {
            "X-RapidAPI-Key": rapidapi_key,
            "X-RapidAPI-Host": "instagram-scraper-stable-api.p.rapidapi.com"
        }
        
        print(f"[DEBUG] Fetching IG Profile URL: {url} with params: {querystring}")
        response = requests.get(url, headers=headers, params=querystring)
        print(f"[DEBUG] Status Code: {response.status_code}")
        
        if response.status_code == 404:
            # Fallback path if the primary endpoint structure differs
            url = "https://instagram-scraper-stable-api.p.rapidapi.com/api/v1/info"
            print(f"[DEBUG] Falling back to URL: {url}")
            response = requests.get(url, headers=headers, params=querystring)
            print(f"[DEBUG] Fallback Status Code: {response.status_code}")
            
        if response.status_code != 200:
             return jsonify({"success": False, "error": f"RapidAPI Endpoint Rejected: {response.text}"}), response.status_code
             
        data = response.json()
        
        # Robust polymorphic JSON parsing across common IG Graph schemas
        user_data = data.get('data', {}).get('user', {}) or data.get('user', {}) or data
        
        bio = user_data.get('biography', '') or user_data.get('about', '')
        followers = 0
        
        if 'edge_followed_by' in user_data:
            followers = user_data['edge_followed_by'].get('count', 0)
        elif 'follower_count' in user_data:
            followers = user_data['follower_count']
        elif 'followers' in user_data:
            followers = user_data['followers']
            
        return jsonify({
            "success": True,
            "followers": followers,
            "bio": bio
        }), 200
        
    except Exception as e:
        print(f"[ERROR] API Scraper exception: {str(e)}")
        return jsonify({"success": False, "error": f"API Scraper logic failed: {str(e)}"}), 500
