from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

# السطر السحري الجديد: إجبار المكتبة على النسخة المستقرة
os.environ["GOOGLE_API_USE_V1"] = "true"

app = Flask(__name__)
CORS(app)

api_key = os.environ.get("GEMINI_API_KEY")

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not api_key:
            return jsonify({"result": "Error: API Key missing."}), 500

        genai.configure(api_key=api_key)
        
        # استخدام الاسم الكامل للموديل لضمان عدم حدوث خطأ 404
        model = genai.GenerativeModel(model_name='models/gemini-1.5-flash')
        
        data = request.json
        prompt = data.get('content', 'Write a fitness hook.')

        response = model.generate_content(prompt)
        
        if response and response.text:
            return jsonify({"result": response.text})
        else:
            return jsonify({"result": "Empty response from AI."})

    except Exception as e:
        return jsonify({"result": f"ZAKAR_FINAL_TEST: {str(e)}"}), 500
