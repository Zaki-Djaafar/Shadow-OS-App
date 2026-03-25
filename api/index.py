from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # جلب المفتاح داخل الدالة لضمان قراءة القيمة الجديدة من Vercel
    api_key = os.environ.get("GEMINI_API_KEY")
    
    try:
        if not api_key or len(api_key) < 10:
            return jsonify({"result": "DEBUG_ERR: API Key is missing or too short!"}), 500

        genai.configure(api_key=api_key)
        
        # محاولة الاتصال المباشر بأبسط صورة
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        data = request.json
        prompt = data.get('content', 'Write a short fitness hook.')
        
        response = model.generate_content(prompt)
        
        if response and response.text:
            return jsonify({"result": response.text})
        else:
            return jsonify({"result": "Empty response from Google. Check API billing/limits."})

    except Exception as e:
        # عرض أول 5 أحرف من المفتاح للتأكد أنه يُقرأ فعلاً من Vercel
        key_preview = api_key[:5] if api_key else "NONE"
        return jsonify({"result": f"ZAKAR_FINAL_CHECK | Key starts with: {key_preview} | Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run()
