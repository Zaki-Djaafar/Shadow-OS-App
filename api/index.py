import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    api_key = os.environ.get("GEMINI_API_KEY")
    
    # سنطلب من جوجل قائمة الموديلات المتاحة لهذا المفتاح تحديداً
    url = f"https://generativelanguage.googleapis.com/v1/models?key={api_key}"

    try:
        response = requests.get(url)
        res_data = response.json()

        if response.status_code == 200:
            # سنعرض لك أسماء الموديلات المسموحة لتنسخها لي هنا
            models = [m['name'] for m in res_data.get('models', [])]
            return jsonify({"result": f"الموديلات المتاحة لك هي: {', '.join(models)}"})
        else:
            error_msg = res_data.get('error', {}).get('message', 'خطأ غير معروف')
            return jsonify({"result": f"خطأ من جوجل: {error_msg}"}), response.status_code

    except Exception as e:
        return jsonify({"result": f"خطأ في النظام: {str(e)}"}), 500
