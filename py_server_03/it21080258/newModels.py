import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostRegressor
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

# Initialize and fit the XGBoost model
xgb_model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
xgb_model.fit(X_train, Y_train)

# Make predictions
Y_pred_xgb = xgb_model.predict(X_test)

# Evaluate the model
mae_xgb = mean_absolute_error(Y_test, Y_pred_xgb)
mse_xgb = mean_squared_error(Y_test, Y_pred_xgb)
r2_xgb = r2_score(Y_test, Y_pred_xgb)

# Print evaluation metrics
print("XGBoost Mean Absolute Error:", mae_xgb)
print("XGBoost Mean Squared Error:", mse_xgb)
print("XGBoost R-squared:", r2_xgb)

# Save the XGBoost model to a file
with open('trained_model_xgboost.pkl', 'wb') as file:
    pickle.dump(xgb_model, file)

# Initialize and fit the LightGBM model
lgb_model = lgb.LGBMRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
lgb_model.fit(X_train, Y_train)

# Make predictions
Y_pred_lgb = lgb_model.predict(X_test)

# Evaluate the model
mae_lgb = mean_absolute_error(Y_test, Y_pred_lgb)
mse_lgb = mean_squared_error(Y_test, Y_pred_lgb)
r2_lgb = r2_score(Y_test, Y_pred_lgb)

# Print evaluation metrics
print("LightGBM Mean Absolute Error:", mae_lgb)
print("LightGBM Mean Squared Error:", mse_lgb)
print("LightGBM R-squared:", r2_lgb)

# Save the LightGBM model to a file
with open('trained_model_lightgbm.pkl', 'wb') as file:
    pickle.dump(lgb_model, file)

# Initialize and fit the CatBoost model
cat_model = CatBoostRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, verbose=0, random_state=42)
cat_model.fit(X_train, Y_train)

# Make predictions
Y_pred_cat = cat_model.predict(X_test)

# Evaluate the model
mae_cat = mean_absolute_error(Y_test, Y_pred_cat)
mse_cat = mean_squared_error(Y_test, Y_pred_cat)
r2_cat = r2_score(Y_test, Y_pred_cat)

# Print evaluation metrics
print("CatBoost Mean Absolute Error:", mae_cat)
print("CatBoost Mean Squared Error:", mse_cat)
print("CatBoost R-squared:", r2_cat)

# Save the CatBoost model to a file
with open('trained_model_catboost.pkl', 'wb') as file:
    pickle.dump(cat_model, file)