from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

api_key = os.environ.get("GEMINI_API_KEY")

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not api_key:
            return jsonify({"result": "DEBUG: API Key is missing in Vercel settings."}), 500

        genai.configure(api_key=api_key)
        
        # محاولة أولى: الموديل السريع
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(request.json.get('content', 'Hello'))
            return jsonify({"result": response.text})
        except Exception as e1:
            # محاولة ثانية: الموديل الأكثر استقراراً كبديل
            model_alt = genai.GenerativeModel('gemini-pro')
            response_alt = model_alt.generate_content(request.json.get('content', 'Hello'))
            return jsonify({"result": response_alt.text})

    except Exception as e:
        return jsonify({"result": f"ZAKAR_DIAGNOSTIC: {str(e)}"}), 500
