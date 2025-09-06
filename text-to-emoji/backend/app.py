from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import base64
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
from rembg import remove 

load_dotenv()
app = Flask(__name__)
CORS(app) 

API_KEY = os.getenv("STABILITY_API_KEY")
OUTPUT_DIR = "emojis"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_emoji(prompt):
    url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    # payload with prompt
    payload = {
        "text_prompts": [{
            "text": (
    f"{prompt}. A single centered emoji icon. The design should use flat colors with minimal shading. "
    "Keep it simple and clean, with a round shape that is highly simplified. Use expressive facial features, "
    "glossy highlights, and bright vibrant colors. It should appear as an isolated icon with a transparent background, "
    "suitable for text messaging. Render it in vector style with sharp edges and no extra objects. "
    "The design must remain minimalistic and consistent with official iOS emoji design."
)
        }],
        "cfg_scale": 7,
        "width": 1024,
        "height": 1024,
        "samples": 1
    }

    # send req to stable diffusion
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code != 200:
        print("Error:", response.status_code, response.text)
        return None

    data = response.json()
    
    # decode the image
    if "artifacts" in data and len(data["artifacts"]) > 0:
        artifact = data["artifacts"][0]
        image_base64 = artifact["base64"]
        image_bytes = base64.b64decode(image_base64)

        # remove background using rembg
        input_image = Image.open(BytesIO(image_bytes))
        transparent_image = remove(input_image)

        # save the transparent image
        file_path = os.path.join(OUTPUT_DIR, f"{prompt.replace(' ', '_')}.png")
        transparent_image.save(file_path)
        print(f"Saved transparent emoji: {file_path}")

        # convert back to base64 for API response
        buffered = BytesIO()
        transparent_image.save(buffered, format="PNG")
        transparent_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return transparent_base64
    
    return None


@app.route('/generate-emoji', methods=['POST'])
def generate_emoji_endpoint():
    try:
        # checks for prompt
        data = request.get_json()
        prompt = data.get('prompt', '').strip()
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if not API_KEY:
            return jsonify({'error': 'API key not configured'}), 500
        
        image_base64 = generate_emoji(prompt)
        
        if image_base64:
            return jsonify({
                'success': True,
                'image': f"data:image/png;base64,{image_base64}"
            })
        else:
            return jsonify({'error': 'Failed to generate emoji'}), 500
            
    except Exception as e:
        print(f"Error in generate_emoji_endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
