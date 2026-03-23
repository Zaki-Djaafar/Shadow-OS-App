from flask import Flask, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

# إعداد Gemini - سيتم جلب المفتاح من إعدادات Vercel لاحقاً للأمان
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash') # أو مودل 2.0 إذا توفر ببيئتك

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    prompt = f"تحليل كخبير تسويق: {data.get('content')}"
    
    response = model.generate_content(prompt)
    return jsonify({"result": response.text})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "Shadow OS Engine is Live!"})
