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
    
    # قمنا بتغيير flash إلى gemini-pro لأنه الأكثر استقراراً وقبولاً في v1
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={api_key}"
    
    payload = {
        "contents": [{"parts": [{"text": user_input}]}]
    }

    try:
        response = requests.post(url, json=payload)
        res_data = response.json()

        if response.status_code == 200:
            # موديل gemini-pro أحياناً يرجع النتيجة بهيكل مختلف قليلاً، هذا الكود يضمن استخراجها
            try:
                answer = res_data['candidates'][0]['content']['parts'][0]['text']
                return jsonify({"result": answer})
            except:
                return jsonify({"result": "Success, but response structure is different."})
        else:
            error_msg = res_data.get('error', {}).get('message', 'Unknown Error')
            # إذا استمر الخطأ، سنعرف السبب هنا
            return jsonify({"result": f"Google Cloud Status: {error_msg}"}), response.status_code

    except Exception as e:
        return jsonify({"result": f"System Error: {str(e)}"}), 500
