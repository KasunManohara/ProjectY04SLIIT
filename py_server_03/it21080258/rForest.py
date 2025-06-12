import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle

# Load the dataset
data = pd.read_csv("Clened_data.csv")

# Separate features and target variable
X = data.drop(columns=['Date', 'Yield'])
Y = data['Yield']

# Check for NaN values in the target variable
print("NaN values in target variable (Yield):", Y.isnull().sum())

# Option 1: Drop rows with NaN values in the target variable
# data_cleaned = data.dropna(subset=['Yield'])
# X_cleaned = data_cleaned.drop(columns=['Date', 'Yield'])
# Y_cleaned = data_cleaned['Yield']

# Option 2: Impute NaN values in the target variable with the mean
Y_cleaned = Y.fillna(Y.mean())

# Split the data into training and testing sets
X_train, X_test, Y_train, Y_test = train_test_split(X, Y_cleaned, test_size=0.2, random_state=42)

# Initialize and fit the Random Forest model
rf_model = RandomForestRegressor(n_estimators=75, random_state=42)
rf_model.fit(X_train, Y_train)

# Make predictions
Y_pred = rf_model.predict(X_test)

# Evaluate the model
mae = mean_absolute_error(Y_test, Y_pred)
mse = mean_squared_error(Y_test, Y_pred)
r2 = r2_score(Y_test, Y_pred)

# Print evaluation metrics
print("Mean Absolute Error:", mae)
print("Mean Squared Error:", mse)
print("R-squared:", r2)

# Save the trained model to a file
with open('trained_model_random_forest.pkl', 'wb') as file:
    pickle.dump(rf_model, file)

# Load the model for prediction (ensure that you are loading the correct model)
with open('trained_model_random_forest.pkl', 'rb') as file:
    loaded_model = pickle.load(file)

# Example prediction
example_input = X_test.iloc[0].values.reshape