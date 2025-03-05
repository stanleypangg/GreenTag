import requests

from config import gemini_client

image_url = "https://goo.gle/instrument-img"
image = requests.get(image_url)

def analyze_image(image):
    prompt = """
        What is this an image of?
    """
    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt,
                  image]
    )
    
    return response.text

print(analyze_image(image))