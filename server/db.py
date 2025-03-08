import time
from config import db
from flask import Blueprint, request, jsonify

db_bp = Blueprint('db_bp', __name__)

@db_bp.route('/items', methods=['POST'])
def create_item():
    try:
        data = request.json
        
        # Add timestamp and validation
        if not data or not 'name' in data:
            return jsonify({'error': 'Invalid data provided'}), 400
            
        # Add timestamp
        data['created_at'] = time.time()
        
        # Add to Firestore
        doc_ref = db.collection('items').document()
        doc_ref.set(data)
        
        # Return the new document with ID
        return jsonify({
            'id': doc_ref.id,
            'message': 'Item created successfully',
            'data': data
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Error creating item: {str(e)}'}), 500

@db_bp.route('/items', methods=['GET'])
def get_items():
    try:
        # Start with the collection reference
        items_ref = db.collection('items')
        
        # Get items
        items = items_ref.get()
        
        # Convert to list
        items_list = []
        for item in items:
            item_data = item.to_dict()
            item_data['id'] = item.id
            items_list.append(item_data)
        
        return jsonify({'items': items_list}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error fetching items: {str(e)}'}), 500

@db_bp.route('/items/<item_id>', methods=['GET'])
def get_item(item_id):
    try:
        doc = db.collection('clothing_items').document(item_id).get()
        
        if not doc.exists:
            return jsonify({'error': 'Item not found'}), 404
            
        item_data = doc.to_dict()
        item_data['id'] = doc.id
        
        return jsonify({'item': item_data}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error fetching item: {str(e)}'}), 500

@db_bp.route('/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Add updated timestamp
        data['updated_at'] = time.time()
        
        # Update in Firestore
        doc_ref = db.collection('clothing_items').document(item_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({'error': 'Item not found'}), 404
            
        doc_ref.update(data)
        
        # Get updated document
        updated_doc = doc_ref.get()
        updated_data = updated_doc.to_dict()
        updated_data['id'] = updated_doc.id
        
        return jsonify({
            'message': 'Item updated successfully',
            'item': updated_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error updating item: {str(e)}'}), 500

@db_bp.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    try:
        doc_ref = db.collection('clothing_items').document(item_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({'error': 'Item not found'}), 404
            
        doc_ref.delete()
        
        return jsonify({'message': 'Item deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error deleting item: {str(e)}'}), 500

def add_item(data):
    """Add an item to Firestore directly"""
    try:
        data['created_at'] = time.time()
        doc_ref = db.collection('clothing_items').document()
        doc_ref.set(data)
        return doc_ref.id
    except Exception as e:
        print(f"Error adding item: {e}")
        return None

def get_item_by_id(item_id):
    """Get item by ID for direct use in other modules"""
    try:
        doc = db.collection('clothing_items').document(item_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            return data
        return None
    except Exception as e:
        print(f"Error getting item: {e}")
        return None