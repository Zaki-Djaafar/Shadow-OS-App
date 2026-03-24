from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# إعداد المفتاح من بيئة Vercel
api_key = os.environ.get("GEMINI_API_KEY")

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not api_key:
            return jsonify({"result": "Error: API Key missing."}), 500

        genai.configure(api_key=api_key)
        
        # استخدام إعدادات افتراضية بسيطة لضمان التوافق
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        data = request.json
        prompt = data.get('content', '')

        # توليد المحتوى مباشرة بدون تعقيد الإعدادات في البداية
        response = model.generate_content(prompt)
        
        if response and response.text:
            return jsonify({"result": response.text})
        else:
            return jsonify({"result": "Engine returned empty."})

    except Exception as e:
        # إذا حدث خطأ، نحاول استخدام الموديل المستقر 1.0 كملاذ أخير
        try:
            model_alt = genai.GenerativeModel('gemini-1.0-pro')
            response = model_alt.generate_content(data.get('content', ''))
            return jsonify({"result": response.text})
        except Exception as second_e:
            return jsonify({"result": f"Technical Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run()
