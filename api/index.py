import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    api_key = os.environ.get("GEMINI_API_KEY")
    user_input = request.json.get('content', '')
    
    # قمنا بتغيير الاسم إلى gemini-1.0-pro وتغيير الرابط قليلاً
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [{"text": user_input}]
            }
        ],
        "generationConfig": {
            "temperature": 0.9,
            "topK": 1,
            "topP": 1,
            "maxOutputTokens": 2048,
            "stopSequences": []
        }
    }

    try:
        response = requests.post(url, json=payload)
        res_data = response.json()

        if response.status_code == 200:
            try:
                # استخراج النص من الهيكل الخاص بـ gemini-1.0-pro
                answer = res_data['candidates'][0]['content']['parts'][0]['text']
                return jsonify({"result": answer})
            except Exception as inner_e:
                return jsonify({"result": f"Data Parsing Error: {str(res_data)}"}), 500
        else:
            # هنا سنعرف الحقيقة المطلقة من جوجل
            error_msg = res_data.get('error', {}).get('message', 'Unknown Error')
            return jsonify({"result": f"Google Final Status: {error_msg}"}), response.status_code

    except Exception as e:
        return jsonify({"result": f"System Error: {str(e)}"}), 500
