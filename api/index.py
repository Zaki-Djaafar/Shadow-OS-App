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
