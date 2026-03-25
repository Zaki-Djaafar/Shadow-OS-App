from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# إعداد المفتاح
api_key = os.environ.get("GEMINI_API_KEY")

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not api_key:
            return jsonify({"result": "Error: API Key missing."}), 500

        # تهيئة سريعة
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        data = request.json
        prompt = data.get('content', 'Write a short fitness marketing hook.')

        # محاولة التوليد مع تقليل التعقيد لسرعة الاستجابة
        response = model.generate_content(prompt)
        
        if response and response.text:
            return jsonify({"result": response.text})
        else:
            return jsonify({"result": "Engine is ready but returned empty. Try again."})

    except Exception as e:
        # رسالة تنبيه واضحة للتأكد من أن الكود يعمل
        return jsonify({"result": f"ZAKAR_SYSTEM: {str(e)}"}), 500

# هذا السطر مهم جداً لـ Vercel
app.debug = False
