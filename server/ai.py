from io import BytesIO
from PIL import Image
from config import gemini_client, db
from flask import Blueprint, request, jsonify
import json
import time
import pprint
from datetime import datetime, timedelta
import random

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
            2. Overall sustainability score (1-100, where 100 is most sustainable)
            3. A clear recommendation for one of these options: 
            - RECYCLE: For items that cannot be reused but materials can be salvaged
            - RESELL: For items in good condition that have market value
            - DONATE: For usable items that could benefit others but may have limited resale value
            
            Format your response as JSON with these fields:
            - materialImpacts: Object with each material and its environmental impact
            - sustainabilityScore: Numeric score 1-100
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
        
def generate_example_items(num_items=5):
    try:
        prompt = f"""
            Generate {num_items} example clothing items with the following attributes:
            - composition: A map (object) of material names (e.g., Cotton, Polyester) to their percentage (as a number).
            Do not include descriptors like organic or recycled, just the material.
            - score: An integer sustainability score between 1 and 100
            - status: A string representing the item's recommended end-of-life status ("Recycle", "Resell", or "Donate")
            - date: A string representing a truly random date within 2024 that the item was processed in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
            - batch_no: A string with a CAPITAL letter prefix based on the status ('C' for Recycle, 'S' for Resell, 'D' for Donate) 
              followed by an integer between 1-3 (e.g., "C1", "S2", "D3")

            Format your response as a list of dictionaries. Each dictionary should represent a clothing item 
            and adhere to the attribute descriptions above.

            Example output:
            [
                {{
                    "composition": {{"Cotton": 95, "Elastane": 5}},
                    "score": 75,
                    "status": "Recycle",
                    "date": "2024-03-08T12:00:00.000Z",
                    "batch_no": "C1"
                }},
                {{
                    "composition": {{"Polyester": 100}},
                    "score": 92,
                    "status": "Resell",
                    "date": "2024-03-08T13:30:00.000Z",
                    "batch_no": "S2"
                }}
            ]

            IMPORTANT: Return ONLY a Python list of dictionaries. Do not use any backticks, only include what's part of the 
            string that represents a list of dictionaries. Do not include any markdown code blocks, 
            explanations, or additional formatting. The output should start with '[' and end with ']' and contain 
            no other text. Do not use newline characters, or backslashes.
            The most important part is you output it in a format, that will later go into the parameter of json.loads(),
            DO NOT OUTPUT AN INVALID FORMAT.
            
            Make sure the batch_no prefix ALWAYS matches the status:
            - "Recycle" status must have batch_no starting with "C" (capital C)
            - "Resell" status must have batch_no starting with "S" (capital S)
            - "Donate" status must have batch_no starting with "D" (capital D)
        """
        
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )

        print(response.text)
        # Directly return the parsed JSON
        try:
            items_list = json.loads(response.text)
            return items_list
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON in generate_example_items: {e}")
            print(f"Gemini response: {response.text}")  # Print the raw response from Gemini
            return None

    except Exception as e:
        print(f"Error generating example items: {e}")
        return None
        
if __name__ == "__main__":
    try:
        items = generate_example_items(75)  # Directly get the parsed JSON
        if items:
            try:
                # Iterate through the list of items and add them to Firestore one by one
                for item in items:
                    # Add each item to Firestore
                    db.collection('items').add(item)
                print("Items added successfully to Firestore!")
                print(items)
            except Exception as e:
                print(f"Error adding items to Firestore: {e}")
    except Exception as e:
        print(f"Failed to generate items: {e}")