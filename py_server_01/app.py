
from flask import Flask, jsonify, request
from flask_cors import CORS
from Download_image import Download_image
from SenddatatoMDB import SenddatatoMDB
from pymongo import MongoClient
from bson import ObjectId
from DeleteImageFB import DeleteImageFB


app = Flask(__name__)
CORS(app)

@app.route("/execute/post", methods=["POST"])  # Separate route for POST requests
def execute_post():
    data = request.json  # Get JSON data from request
    URL = data.get("imageUrl")
    
   # SenddatatoMDB("ok",data)
    
    Download_image(URL,data)
    
    return jsonify({"message": "POST function executed!"})


@app.route('/get_pot_data', methods=['GET'])
def get_pot_data():
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21014604:it21014604@mushroomc.ql6ll.mongodb.net/?retryWrites=true&w=majority&appName=mushroomc')
    db = client['mushroomc']
    collection = db['contaminations']

    try:
        # Fetch all records from the collection
        results = list(collection.find())

        # Convert ObjectId to string for JSON serialization
        for result in results:
            result['_id'] = str(result['_id'])

        return jsonify(results), 200

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching data.'}), 500

@app.route('/delete_pot', methods=['POST'])
def delete_pot():
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21014604:it21014604@mushroomc.ql6ll.mongodb.net/?retryWrites=true&w=majority&appName=mushroomc')
    db = client['mushroomc']
    collection = db['contaminations']

    try:
        # Get the JSON data from the request body
        data = request.get_json()
        
        # Ensure that an Id is provided
        if 'Id' not in data:
            return jsonify({'message': 'Id is required.'}), 400
        
        # Ensure that an AffectedImageUrl is provided
        if 'AffectedImageUrl' not in data:
            return jsonify({'message': 'AffectedImageUrl is required.'}), 400
        
        # Ensure that an GoodImageUrl is provided
        if 'GoodImageUrl' not in data:
            return jsonify({'message': 'GoodImageUrl is required.'}), 400        
        
        # Convert the string Id to ObjectId
        object_id = ObjectId(data['Id'])



        try:
            DeleteImageFB(data['AffectedImageUrl'])
            DeleteImageFB(data['GoodImageUrl'])   
        except Exception as e: 
            print(f"An error occurred: {e}")
            return jsonify({'message': 'Image Submission related irssue.'}), 402      

       # Delete the record with the specified Id
        delete_result = collection.delete_one({'_id': object_id})

        if delete_result.deleted_count == 1:
            return jsonify({'message': 'Deleted the record successfully.'}), 200
        else:
            return jsonify({'message': 'No record found with the given Id.'}), 404

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred while deleting data.'}), 500

@app.route('/find_single_record', methods=['POST'])
def find_single_record():
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21014604:it21014604@mushroomc.ql6ll.mongodb.net/?retryWrites=true&w=majority&appName=mushroomc')
    db = client['mushroomc']
    collection = db['contaminations']

    # Get the JSON data from the request body
    data = request.get_json()

    # Ensure that an RackNumber is provided
    if 'RackNumber' not in data:
        return jsonify({'message': 'RackNumber is required.'}), 400

    # Specify the name to search for
    name_to_find = data.get("RackNumber")

    # Find all documents with the specified Racknumber
    documents = collection.find({"Racknumber": name_to_find})

    # Collect found documents into a list
    results = []
    for document in documents:
        results.append({
            "Affected_Image_Url": document.get('Affected_Image_Url'),
            "Good_Image_Url": document.get('Good_Image_Url'),
            "Image_Date": document.get('Image_Date'),
            "Racknumber": document.get('Racknumber'),
            "State": document.get('State'),
            "ID": str(document.get('_id'))  # Convert ObjectId to string for JSON serialization
        })

    # Check if results are empty and return appropriate response
    if not results:
        return jsonify({"message": "No records found for the specified Racknumber."}), 404

    # Return results as JSON
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)