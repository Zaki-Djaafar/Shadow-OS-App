from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    api_key = os.environ.get("GEMINI_API_KEY")
    try:
        # إعداد الإعدادات قبل أي شيء آخر
        genai.configure(api_key=api_key)
        
        # إجبار الموديل على استخدام المسار الكامل والمستقر
        # لاحظ إضافة "models/" وتجنب أي ذكر لـ beta
        model = genai.GenerativeModel(model_name='models/gemini-1.5-flash')
        
        data = request.json
        prompt = data.get('content', 'Hello')

        # محاولة الطلب
        response = model.generate_content(prompt)
        
        if response.text:
            return jsonify({"result": response.text})
        return jsonify({"result": "Success but empty text."})

    except Exception as e:
        # إذا فشل، سنحاول "الموديل القديم" الذي يعمل في كل مكان
        try:
            model_alt = genai.GenerativeModel(model_name='models/gemini-pro')
            res = model_alt.generate_content(data.get('content', 'Hello'))
            return jsonify({"result": res.text})
        except Exception as e2:
            return jsonify({"result": f"ZAKAR_ULTIMATE_ERROR: {str(e)}"}), 500
