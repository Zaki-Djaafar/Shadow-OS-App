from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app) # يسمح للموقع بالاتصال بالسيرفر دون قيود

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        prompt = data.get('content', 'No content provided')
        
        response = model.generate_content(prompt)
        return jsonify({"result": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# هذا المسار للاختبار فقط للتأكد أن السيرفر يعمل
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "Shadow OS Engine is Live!"})
