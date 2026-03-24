from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# جلب المفتاح والتأكد من وجوده
api_key = os.environ.get("GEMINI_API_KEY")

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if not api_key:
            return jsonify({"result": "Error: GEMINI_API_KEY is missing in Vercel Settings."}), 500

        genai.configure(api_key=api_key)
        # استخدام مودل مستقر 1.5 flash
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        data = request.json
        prompt = data.get('content', '')

        response = model.generate_content(prompt)
        
        if response and response.text:
            return jsonify({"result": response.text})
        else:
            return jsonify({"result": "Gemini returned an empty response. Try a different prompt."})

    except Exception as e:
        # هذا السطر سيظهر لنا الخطأ الحقيقي بدلاً من كلمة Failed
        return jsonify({"result": f"Internal Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
