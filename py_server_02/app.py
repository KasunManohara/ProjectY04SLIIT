import tensorflow as tf
import os
import math
import joblib
import numpy as np
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS

# Set the environment variable to disable oneDNN optimizations
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Connect to MongoDB
client = None
db = None
collection = None

app = Flask(__name__)

# Define the relative path to the model directory
model_dir = os.path.join(app.root_path, 'resources')

# Load models using relative paths
with open(os.path.join(model_dir, 'customer_model.joblib'), 'rb') as file:
    model_01 = joblib.load(file)

with open(os.path.join(model_dir, 'shop_model.joblib'), 'rb') as file:
    model_02 = joblib.load(file)

########################################################################################
# /add_predict_customer_demand

@app.route('/add_predict_customer_demand', methods=['POST'])
def add_predict_customer_demand():

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictCustomerDemand']

    districtNameArray = [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
        'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
        'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
        'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
        'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ]

    try:
        data = request.get_json()
        districtCode = data['districtCode']
        memberCount = data['memberCount']

        # Validate districtCode
        if districtCode < 0 or districtCode >= len(districtNameArray):
            return jsonify({'error': f'Invalid district code: {districtCode}'}), 400

        # Validate memberCount
        if memberCount < 1 :
            return jsonify({'error': f'Invalid member count: {memberCount}'}), 400
        
        # Prepare input data for prediction
        param_aom = tf.Variable([[0, districtCode, memberCount]])
        param_bm = tf.Variable([[1, districtCode, memberCount]])
        param_bom = tf.Variable([[2, districtCode, memberCount]])
        param_pom = tf.Variable([[3, districtCode, memberCount]])

        # Make predictions
        prediction_aom = model_01.predict(param_aom)
        prediction_bm = model_01.predict(param_bm)
        prediction_bom = model_01.predict(param_bom)
        prediction_pom = model_01.predict(param_pom)

        prediction_aom = int( math.ceil( ( prediction_aom[0][0] * ( 10 - 0 ) ) + 0 ) )
        prediction_bm = int( math.ceil( ( prediction_bm[0][0] * ( 10 - 0 ) ) + 0 ) )
        prediction_bom = int( math.ceil( ( prediction_bom[0][0] * ( 10 - 0 ) ) + 0 ) )
        prediction_pom = int( math.ceil( ( prediction_pom[0][0] * ( 10 - 0 ) ) + 0 ) )

        # Process predictions
        result = {
            'district_code': districtCode,
            'district_name': districtNameArray[districtCode],
            'total_members': memberCount,
            'prediction_aom': prediction_aom,
            'prediction_bm': prediction_bm,
            'prediction_bom': prediction_bom,
            'prediction_pom': prediction_pom
        }

        # Insert result into MongoDB
        result_inserted = collection.insert_one(result)

        # Convert ObjectId to string for JSON serialization
        result['_id'] = str(result_inserted.inserted_id)
        
        return jsonify(result), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

########################################################################################
# /get_predict_customer_demand

@app.route('/get_predict_customer_demand', methods=['GET'])
def get_predict_customer_demand():

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictCustomerDemand']

    try:
        # Find the latest prediction result from the collection
        result = collection.find_one(sort=[('_id', -1)])

        if result:
            # Convert ObjectId to string for JSON serialization
            result['_id'] = str(result['_id'])
            return jsonify(result), 200
        else:
            return jsonify({'error': 'No predictions found'}), 404

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching data.'}), 500

########################################################################################
# /add_predict_shop_demand

@app.route('/add_predict_shop_demand', methods=['POST'])
def add_predict_shop_demand():

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictShopDemand']

    districtNameArray = [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
        'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
        'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
        'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
        'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ]

    mushroomNameArray = [
        'American Oyster Mushroom (AOM)', 
        'Button Mushroom (BM)' , 
        'Bhutan Oyster Mushroom (BOM)' , 
        'Pink Oyster Mushroom (POM)' , 
        'Abalone Mushroom (AM)'
    ]

    try:
        data = request.get_json()
        mushroomCode = data['mushroomCode']
        districtCode = data['districtCode']
        observedDailySales = data['observedDailySales']
        expectDailySalesGrowth = data['expectDailySalesGrowth']
        
        # Validate mushroomCode
        if mushroomCode < 0 or (mushroomCode in [1, 2, 3] ) or mushroomCode >= len(mushroomNameArray):
            return jsonify({'error': f'Invalid mushroom code: {mushroomCode}'}), 400
        
        if mushroomCode == 0 :
            collection = db['predictShopDemandAom']
        else :
            collection = db['predictShopDemandAm']

        # Validate districtCode
        if districtCode < 0 or districtCode >= len(districtNameArray):
            return jsonify({'error': f'Invalid district code: {districtCode}'}), 400
        
        # Validate observedDailySale
        if observedDailySales < 0 :
            return jsonify({'error': f'Invalid observed daily sales: {observedDailySales}'}), 400

        # Validate expectDailySalesGrowth
        if expectDailySalesGrowth not in [0, 1] :
            return jsonify({'error': f'Invalid expect daily sales growth: {expectDailySalesGrowth}'}), 400
        
        # Prepare input data for prediction
        param = tf.Variable([[mushroomCode, districtCode, observedDailySales, expectDailySalesGrowth]])

        # Make predictions
        prediction = model_02.predict(param)

        cy_yearly_sales = int( math.ceil( ( prediction[0][0] * ( 11413 - 1105 ) ) + 1105 ) )
        cy_monthly_sales = int( math.ceil( ( prediction[0][1] * ( 952 - 93 ) ) + 93 ) )
        fy_yearly_sales = int( math.ceil( ( prediction[0][2] * ( 16857 - 1078 ) ) + 1078 ) )
        fy_monthly_sales = int( math.ceil( ( prediction[0][3] * ( 1404 - 89 ) ) + 89 ) )
        fy_daily_sales = int( math.ceil( ( prediction[0][4] * ( 46 - 2 ) ) + 2 ) )

        c_daily_sales = observedDailySales

        # Process predictions
        result = {
            'c_daily_sales': c_daily_sales,
            'cy_yearly_sales': cy_yearly_sales,
            'cy_monthly_sales': cy_monthly_sales,
            'district_code': districtCode,
            'district_name': districtNameArray[districtCode],
            'fy_daily_sales': fy_daily_sales,
            'fy_yearly_sales': fy_yearly_sales,
            'fy_monthly_sales': fy_monthly_sales,
            'mushroom_code': mushroomCode,
            'mushroom_name': mushroomNameArray[mushroomCode],
        }

        # Insert result into MongoDB
        result_inserted = collection.insert_one(result)

        # Convert ObjectId to string for JSON serialization
        result['_id'] = str(result_inserted.inserted_id)
        
        return jsonify(result), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

########################################################################################
# /get_predict_shop_demand_aom

@app.route('/get_predict_shop_demand_aom', methods=['GET'])
def get_predict_shop_demand_aom():

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictShopDemandAom']

    try:
        # Find the latest 7 prediction results from the collection
        results = list(collection.find().sort('_id', -1).limit(7))

        if results:
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result['_id'] = str(result['_id'])
            return jsonify(results), 200
        else:
            return jsonify({'error': 'No predictions found'}), 404

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching data.'}), 500

########################################################################################
# /get_predict_shop_demand_am

@app.route('/get_predict_shop_demand_am', methods=['GET'])
def get_predict_shop_demand_am():
    
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictShopDemandAm']

    try:
        # Find the latest prediction result from the collection
        results = list(collection.find().sort('_id', -1).limit(7))

        if results:
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result['_id'] = str(result['_id'])
            return jsonify(results), 200
        else:
            return jsonify({'error': 'No predictions found'}), 404

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching data.'}), 500

########################################################################################
# /delete_old_customer_demand_records

@app.route('/delete_old_customer_demand_records', methods=['DELETE'])
def delete_old_customer_demand_records():

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictCustomerDemand']

    try:
        # Get the count of records in the collection
        record_count = collection.count_documents({})

        if record_count > 1:
            # Find the latest record
            latest_record = collection.find_one(sort=[('_id', -1)])

            if latest_record:
                # Extract the _id of the latest record
                latest_id = latest_record['_id']

                # Delete all records except the latest one
                delete_result = collection.delete_many({'_id': {'$ne': latest_id}})

                if(delete_result.deleted_count == 1):
                    return jsonify({'message': f'Deleted {delete_result.deleted_count} old record.'}), 200
                else:
                    return jsonify({'message': f'Deleted {delete_result.deleted_count} old records.'}), 200
        else:
            return jsonify({'message': 'There are only one record. No need to delete.'}), 200

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred while deleting data.'}), 500

########################################################################################
# /delete_old_shop_demand_records_aom

@app.route('/delete_old_shop_demand_records_aom', methods=['DELETE'])
def delete_old_shop_demand_records_aom():

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictShopDemandAom']

    try:
        # Get the count of records in the collection
        record_count = collection.count_documents({})

        if record_count > 7:
            # Find the latest 7 records
            latest_records = list(collection.find().sort('_id', -1).limit(7))

            if latest_records:
                # Extract the _id of the latest records
                latest_ids = [result['_id'] for result in latest_records]

                # Delete all records except the latest 7
                delete_result = collection.delete_many({'_id': {'$nin': latest_ids}})

                if(delete_result.deleted_count == 1):
                    return jsonify({'message': f'Deleted {delete_result.deleted_count} old record.'}), 200
                else:
                    return jsonify({'message': f'Deleted {delete_result.deleted_count} old records.'}), 200
        else:
            return jsonify({'message': 'There are only seven records. No need to delete.'}), 200

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred while deleting data.'}), 500

########################################################################################
# /delete_old_shop_demand_records_am

@app.route('/delete_old_shop_demand_records_am', methods=['DELETE'])
def delete_old_shop_demand_records_am():

    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictShopDemandAm']

    try:
        # Get the count of records in the collection
        record_count = collection.count_documents({})

        if record_count > 7:
            # Find the latest 7 records
            latest_records = list(collection.find().sort('_id', -1).limit(7))

            if latest_records:
                # Extract the _id of the latest records
                latest_ids = [result['_id'] for result in latest_records]

                # Delete all records except the latest 7
                delete_result = collection.delete_many({'_id': {'$nin': latest_ids}})
                
                if(delete_result.deleted_count == 1):
                    return jsonify({'message': f'Deleted {delete_result.deleted_count} old record.'}), 200
                else:
                    return jsonify({'message': f'Deleted {delete_result.deleted_count} old records.'}), 200
        else:
            return jsonify({'message': 'There are only seven records. No need to delete.'}), 200

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred while deleting data.'}), 500

########################################################################################
# /get_predict_shop_demand_district_aom

@app.route('/get_predict_shop_demand_district_aom', methods=['GET'])
def get_predict_shop_demand_district_aom():
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictShopDemandAom']

    try:
        # Use aggregation to get unique records based on 'district_name'
        pipeline = [
            {
                '$sort': {
                    '_id': -1  # Sort by _id in descending order
                }
            },
            {
                '$group': {
                    '_id': '$district_name',  # Group by district_name
                    'latest_prediction': {'$first': '$$ROOT'}  # Get the first occurrence of each group
                }
            },
            {
                '$replaceRoot': {
                    'newRoot': '$latest_prediction'  # Replace the root with the latest prediction document
                }
            },
            {
                '$limit': 7  # Limit to the latest 7 unique districts
            }
        ]

        results = list(collection.aggregate(pipeline))

        if results:
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result['_id'] = str(result['_id'])
            return jsonify(results), 200
        else:
            return jsonify({'error': 'No predictions found'}), 404

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching data.'}), 500

########################################################################################
# /get_predict_shop_demand_district_am

@app.route('/get_predict_shop_demand_district_am', methods=['GET'])
def get_predict_shop_demand_district_am():
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://it21034268:oKNtVV3QK83Vu8S8@demandpred.kvxbz.mongodb.net/?retryWrites=true&w=majority&appName=demandPred')
    db = client['demandPred']
    collection = db['predictShopDemandAm']

    try:
        # Use aggregation to get unique records based on 'district_name'
        pipeline = [
            {
                '$sort': {
                    '_id': -1  # Sort by _id in descending order
                }
            },
            {
                '$group': {
                    '_id': '$district_name',  # Group by district_name
                    'latest_prediction': {'$first': '$$ROOT'}  # Get the first occurrence of each group
                }
            },
            {
                '$replaceRoot': {
                    'newRoot': '$latest_prediction'  # Replace the root with the latest prediction document
                }
            },
            {
                '$limit': 7  # Limit to the latest 7 unique districts
            }
        ]

        results = list(collection.aggregate(pipeline))

        if results:
            # Convert ObjectId to string for JSON serialization
            for result in results:
                result['_id'] = str(result['_id'])
            return jsonify(results), 200
        else:
            return jsonify({'error': 'No predictions found'}), 404

    except Exception as e:
        # Log the exception for debugging purposes (optional)
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching data.'}), 500

########################################################################################

if __name__ == '__main__':
    app.run(debug=True)