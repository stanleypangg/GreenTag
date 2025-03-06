from io import BytesIO
from PIL import Image
from config import gemini_client
from flask import Blueprint, request, jsonify

ai_bp = Blueprint('ai_bp', __name__)

@ai_bp.route('/analyze_image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({
            'error': 'No image provided'
        }), 400
    
    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    try:
        # Load image in
        image_bytes = image_file.read()
        image_data = BytesIO(image_bytes)
        image = Image.open(image_data)
        
        # TODO: Optimize prompt engineering
        prompt = """
            This image shows a clothing tag or label. Please:
        
            1. Extract all text visible in the image, especially focusing on material composition
            2. Identify percentages of different materials (cotton, polyester, wool, etc.)
            3. Parse any care instructions visible in the image
            4. Note any brand information if visible
            
            Format your response as JSON with these fields:
            - materials: An object with material names as keys and percentage values (number only)
            - careInstructions: Array of care instructions
            - brand: Brand name if visible, otherwise null
            - additionalText: Any other relevant text from the image
            
            Example output:
            {
            "materials": {
                "cotton": 60,
                "polyester": 35,
                "elastane": 5
            },
            "careInstructions": ["Machine wash cold", "Tumble dry low"],
            "brand": "Example Brand",
            "additionalText": "Made in Portugal"
            }
            
            If no materials are visible, return an empty materials object.
            
            IMPORTANT: Return ONLY a raw, valid JSON object. Do not include any markdown code blocks, explanations, 
            or additional formatting. The output should start with '{' and end with '}' and contain no other text.
            Make sure to format it like the example output. Do not use newline characters, or backslashes.
        """
        
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt, image]
        )
        
        print(response.text)
        
        # TODO: Change json structure
        return jsonify({
            'result': response.text
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error processing image: {str(e)}'
        }), 500
        
@ai_bp.route('/analyze_sustainability', methods=['POST'])
def analyze_sustainability():
    if not request.json:
        return jsonify({
            'error': 'No JSON provided'
        }), 400
    
    materials_json = request.json
    
    try:
        # TODO: Optimize prompt engineering
        prompt = f"""
            Based on this clothing item's material composition, analyze its sustainability and provide a recommendation.

            Material composition: {materials_json}

            Please provide:
            1. Environmental impact assessment for each material (rated as low, medium, or high impact)
            2. Overall sustainability score (1-10, where 10 is most sustainable)
            3. A clear recommendation for one of these options: 
            - RECYCLE: For items that cannot be reused but materials can be salvaged
            - RESELL: For items in good condition that have market value
            - DONATE: For usable items that could benefit others but may have limited resale value
            
            Format your response as JSON with these fields:
            - materialImpacts: Object with each material and its environmental impact
            - sustainabilityScore: Numeric score 1-10
            - recommendation: One of "RECYCLE", "RESELL", or "DONATE"
            - reasoning: Brief explanation for the recommendation
        """
        
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )

        print(response.text)
        
        return jsonify({
            'result': response.text
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Error processing json: {str(e)}'
        }), 500