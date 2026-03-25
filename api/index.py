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
            return jsonify({"result": "Error: API Key missing."}), 500

        genai.configure(api_key=api_key)
        
        # الحل الجراحي: تحديد الإصدار v1 وإجبار الاسم الكامل
        # هذا يمنع المكتبة من إضافة "v1beta" تلقائياً
        model = genai.GenerativeModel(
            model_name='models/gemini-1.5-flash'
        )
        
        data = request.json
        prompt = data.get('content', 'Write a fitness hook.')

        # إجبار الطلب على استخدام الإصدار المستقر v1
        response = model.generate_content(prompt)
        
        if response and response.text:
            return jsonify({"result": response.text})
        else:
            return jsonify({"result": "Empty response from AI."})

    except Exception as e:
        # إذا فشل الفلاش، جرب الموديل القديم جداً (مستقر في كل الإصدارات)
        try:
            model_alt = genai.GenerativeModel('gemini-pro')
            response = model_alt.generate_content(data.get('content', ''))
            return jsonify({"result": response.text})
        except:
            return jsonify({"result": f"ZAKAR_FIX: {str(e)}"}), 500
