from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors  import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
with open("./it21080258/trained_model_random_forest.pkl", "rb") as file:
    yield_rf_model = pickle.load(file)

@app.route("/yield/predict", methods=['POST'])
def predict_yield():
    try:
        data = request.json
        features = [data['Noofpots'],data['TempInside'],data['HumidInside'],data['CO2Inside'],data['TempOutside'],data['HumidOutside'],data['CO2Outside']]
        features_array = np.array(features).reshape(1, -1)
        
        
        prediction = yield_rf_model.predict(features_array)[0]
        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)


