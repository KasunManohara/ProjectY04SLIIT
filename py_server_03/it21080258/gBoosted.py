import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score
import pickle

# Load the dataset
data = pd.read_csv("Clened_data.csv")

# Separate features and target variable
X = data.drop(columns=['Date', 'Yield'])
Y = data['Yield']

# Check for NaN values in the target variable
print("NaN values in target variable (Yield):", Y.isnull().sum())

# Handle NaN values if necessary (this should be done before this point)
# Example: Y = Y.fillna(Y.mean())

# Split the data into training and testing sets
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Initialize and fit the Gradient Boosting model
gb_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
gb_model.fit(X_train, Y_train)

# Make predictions
Y_pred = gb_model.predict(X_test)

# Evaluate the model
mae = mean_absolute_error(Y_test, Y_pred)
mse = mean_squared_error(Y_test, Y_pred)
r2 = r2_score(Y_test, Y_pred)

# Calculate accuracy
accuracy = accuracy_score(Y_test, np.round(Y_pred))

# Print evaluation metrics
print("Mean Absolute Error:", mae)
print("Mean Squared Error:", mse)
print("R-squared:", r2)
print("Accuracy:", accuracy)

# Save the trained model to a file
with open('trained_model_gradient_boosting.pkl', 'wb') as file:
    pickle.dump(gb_model, file)

# Load the model for prediction (ensure that you are loading the correct model)
with open('trained_model_gradient_boosting.pkl', 'rb') as file:
    loaded_model = pickle.load(file)

# Example prediction
example_input = X_test.iloc[0]  # Get the first row of the test set
predicted_yield = loaded_model.predict(example_input.values.reshape(1, -1))  # Reshape for a single sample
print("Predicted Yield:", predicted_yield)