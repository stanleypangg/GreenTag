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
        
        # Enhanced prompt for better material composition analysis
        prompt = """
            Analyze this clothing tag or label and extract the following information:
        
            1. Material composition (percentages of different materials)
            2. Care instructions if visible
            3. Brand name if visible
            
            Return your analysis as a dictionary with the following structure:
            {
                "composition": {"MaterialName": Percentage, ...},
                "careInstructions": ["Instruction1", "Instruction2", ...],
                "brand": "BrandName",
                "additionalText": "Any other relevant text"
            }
            
            Make sure all material names have their first letter capitalized.
            Material percentages should sum to 100%.
        """
        
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt, image]
        )
        
        print("Gemini response for image analysis:", response.text)
        
        try:
            # Try to extract JSON from the response
            # This regex approach helps handle cases where the AI might wrap JSON in markdown
            import re
            json_match = re.search(r'{.*}', response.text, re.DOTALL)
            if json_match:
                json_text = json_match.group(0)
                analysis_result = json.loads(json_text)
            else:
                # If no JSON pattern is found, try parsing the whole response
                analysis_result = json.loads(response.text)
            
            # Extract composition from the response
            composition = {}
            if "composition" in analysis_result:
                composition = analysis_result["composition"]
            elif "materials" in analysis_result:
                composition = analysis_result["materials"]
            
            # Ensure material names are capitalized
            composition = {k.capitalize(): v for k, v in composition.items()}
            
            # Now analyze sustainability based on materials
            sustainability_prompt = f"""
                Analyze the sustainability of a clothing item with this material composition:
                {composition}

                Return a dictionary with:
                1. sustainabilityScore: An integer score from 1-100 (higher is more sustainable)
                2. recommendation: One of "RECYCLE", "RESELL", or "DONATE" based on materials
                
                Format your response as a Python dictionary:
                {{
                    "sustainabilityScore": 75,
                    "recommendation": "RECYCLE"
                }}
                
                Do not include any explanations or markdown formatting.
            """
            
            sustainability_response = gemini_client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[sustainability_prompt]
            )
            
            print("Sustainability analysis:", sustainability_response.text)
            
            try:
                # Extract JSON from sustainability response
                json_match = re.search(r'{.*}', sustainability_response.text, re.DOTALL)
                if json_match:
                    json_text = json_match.group(0)
                    sustainability_data = json.loads(json_text)
                else:
                    sustainability_data = json.loads(sustainability_response.text)
                
                # Get the recommendation and ensure it's properly formatted
                recommendation = sustainability_data.get("recommendation", "RECYCLE").title()
                
                # Map the prefix letter based on recommendation
                status_prefix = {
                    "Recycle": "C",
                    "Resell": "S", 
                    "Donate": "D"
                }.get(recommendation, "C")
                
                # Generate random batch number 1-3
                batch_number = f"{status_prefix}{random.randint(1, 3)}"
                
                # Generate a random ID for the item
                item_id = f"TAG{random.randint(10000, 99999)}"
                
                # Create the final response object with the exact structure needed
                result = {
                    "id": item_id,
                    "composition": composition,
                    "score": int(sustainability_data.get("sustainabilityScore", 50)),
                    "status": recommendation,
                    "date": datetime.now().isoformat(),
                    "batch_no": batch_number
                }
                
                # Store the analysis in the database
                db.collection('items').document(item_id).set(result)
                
                print(result)
                
                return jsonify({
                    'result': result
                }), 200
                
            except json.JSONDecodeError as e:
                print(f"Error parsing sustainability analysis: {e}")
                # Fallback to a default response if sustainability analysis fails
                item_id = f"TAG{random.randint(10000, 99999)}"
                default_result = {
                    "id": item_id,
                    "composition": composition,
                    "score": 50,
                    "status": "Recycle",
                    "date": datetime.now().isoformat(),
                    "batch_no": "C1"
                }
                
                # Store the fallback analysis in the database
                db.collection('items').document(item_id).set(default_result)
                
                return jsonify({
                    'result': default_result,
                    'message': 'Using default sustainability values'
                }), 200
                
        except json.JSONDecodeError as e:
            print(f"Error parsing Gemini response: {e}")
            # Generate a completely dummy result if parsing fails
            item_id = f"TAG{random.randint(10000, 99999)}"
            dummy_result = {
                "id": item_id,
                "composition": {"Cotton": 100},
                "score": 50,
                "status": "Recycle",
                "date": datetime.now().isoformat(),
                "batch_no": "C1"
            }
            
            db.collection('items').document(item_id).set(dummy_result)
            
            return jsonify({
                'result': dummy_result,
                'message': 'Using fallback values due to parsing error',
                'error': str(e),
                'rawResponse': response.text
            }), 200
        
    except Exception as e:
        print(f"Error in analyze_image: {e}")
        return jsonify({
            'error': f'Error processing image: {str(e)}'
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