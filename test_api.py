from api.index import app
import os
import json

app.testing = True
client = app.test_client()

# Ensure we have a fake API key for test if not set to avoid local OS crash (gemini call will fail but flask won't crash)
if not os.environ.get("GEMINI_API_KEY"):
    os.environ["GEMINI_API_KEY"] = "dummy_key"

print("--- Testing /api/synthesize ---")
response = client.post('/api/synthesize', json={"niche": "Fitness", "rawContent": "Lifting weights makes you strong"})
print("Status Code:", response.status_code)
print("Response Data:", response.get_data(as_text=True))

print("\n--- Testing /api/analyze ---")
response = client.post('/api/analyze', json={"content": "Here is an input"})
print("Status Code:", response.status_code)
print("Response Data:", response.get_data(as_text=True))

print("\n--- Testing /api/manychat ---")
response = client.post('/api/manychat', json={"product": "Fitness guide"})
print("Status Code:", response.status_code)
print("Response Data:", response.get_data(as_text=True))
