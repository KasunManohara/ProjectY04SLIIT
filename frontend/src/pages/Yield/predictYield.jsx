import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  Divider,
  Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const PredictYield = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    Noofpots: "",
    TempInside: "",
    HumidInside: "",
    CO2Inside: "",
    TempOutside: "",
    HumidOutside: "",
    CO2Outside: ""
  });
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);

  // Fetch all data on component load
  useEffect(() => {
    fetchAllData();
  }, []);

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "Noofpots":
        if (!/^\d+$/.test(value)) {
          error = "No of Pots must be an integer";
        }
        break;
      case "TempInside":
      case "TempOutside":
        if (isNaN(value) || value < 14 || value > 36) {
          error = "Temperature must be a floating value between 14.00 and 36.00";
        }
        break;
      case "HumidInside":
      case "HumidOutside":
        if (isNaN(value) || value < 64 || value > 100) {
          error = "Humidity must be a floating value between 64.00 and 100.00";
        }
        break;
      case "CO2Inside":
      case "CO2Outside":
        if (isNaN(value)) {
          error = "CO2 must be a floating value";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validate(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      return; // Don't submit if there are errors
    }

    // Round the floating point values to 2 decimal places
    const roundedFormData = {
      Noofpots: formData.Noofpots, // No need to round integer
      TempInside: Number(formData.TempInside).toFixed(2),
      HumidInside: Number(formData.HumidInside).toFixed(2),
      CO2Inside: Number(formData.CO2Inside).toFixed(2),
      TempOutside: Number(formData.TempOutside).toFixed(2),
      HumidOutside: Number(formData.HumidOutside).toFixed(2),
      CO2Outside: Number(formData.CO2Outside).toFixed(2),
    };

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4050/yield/predict", roundedFormData);
      setPrediction(response.data.prediction);

      const payload = {
        ...roundedFormData,
        Yield: Number(response.data.prediction).toFixed(2) // Round the predicted yield too
      };

      await axios.post("http://localhost:8080/api/v1/predictyield", payload); // Save to DB

      setFormData({
        Noofpots: "",
        TempInside: "",
        HumidInside: "",
        CO2Inside: "",
        TempOutside: "",
        HumidOutside: "",
        CO2Outside: ""
      });

      setLoading(false);
      fetchAllData(); // Refresh data in table
    } catch (error) {
      console.error("Prediction error:", error);
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/predictyield");
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/predictyield/${id}`);
      fetchAllData(); // Refresh table after delete
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const textFieldProps = {
    variant: "outlined",
    color: "primary",
    fullWidth: true,
    required: true,
    sx: {
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: 'primary.main',
        },
      },
      mb: 2
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
            mb: 1 
          }}>
            Yield Prediction
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

        {/* Form Card */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Card elevation={3} sx={{ maxWidth: '700px' }}>
            <CardContent sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
                  gap: 2,
                  mb: 2 
                }}>
                  <Box>
                   
                    <TextField
                    {...textFieldProps}
                    label="No of Pots"
                    name="Noofpots"
                    value={formData.Noofpots}
                    onChange={handleChange}
                    error={!!errors.Noofpots}
                    helperText={errors.Noofpots}
                  />
                    <TextField
                      {...textFieldProps}
                      label="Temperature Inside"
                      name="TempInside"
                      value={formData.TempInside}
                      onChange={handleChange}
                      error={!!errors.TempInside}
                      helperText={errors.TempInside}
                    />
                    <TextField
                      {...textFieldProps}
                      label="CO2 Inside"
                      name="CO2Inside"
                      value={formData.CO2Inside}
                      onChange={handleChange}
                      error={!!errors.CO2Inside}
                      helperText={errors.CO2Inside}
                    />
                    <TextField
                      {...textFieldProps}
                      label="Humidity Inside"
                      name="HumidInside"
                      value={formData.HumidInside}
                      onChange={handleChange}
                      error={!!errors.HumidInside}
                      helperText={errors.HumidInside}
                    />
                  </Box>

                  {/* Outside Parameters */}
                  <Box>
                 
                    <TextField
                      {...textFieldProps}
                      label="Temperature Outside"
                      name="TempOutside"
                      value={formData.TempOutside}
                      onChange={handleChange}
                      error={!!errors.TempOutside}
                      helperText={errors.TempOutside}
                    />
                    <TextField
                      {...textFieldProps}
                      label="CO2 Outside"
                      name="CO2Outside"
                      value={formData.CO2Outside}
                      onChange={handleChange}
                      error={!!errors.CO2Outside}
                      helperText={errors.CO2Outside}
                    />
                    <TextField
                      {...textFieldProps}
                      label="Humidity Outside"
                      name="HumidOutside"
                      value={formData.HumidOutside}
                      onChange={handleChange}
                      error={!!errors.HumidOutside}
                      helperText={errors.HumidOutside}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    type="submit"
                    sx={{
                      py: 1.5,
                      px: 4,
                      mt: 2,
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Predict Yield"}
                  </Button>
                </Box>
              </form>

              {prediction && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 3,
                    '& .MuiAlert-message': { 
                      fontWeight: 500 
                    }
                  }}
                >
                  Predicted Yield: {prediction}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Table Card */}
        <Card elevation={3}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              Historical Predictions
            </Typography>
            
            <TableContainer component={Paper} sx={{ 
              boxShadow: 'none',
              bgcolor: 'background.default' 
            }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>No of Pots</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Temp Inside</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CO2 Inside</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Humidity Inside</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Temp Outside</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CO2 Outside</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Humidity Outside</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Yield</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow 
                      key={row._id}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'action.hover' 
                        }
                      }}
                    >
                      <TableCell>{row.Noofpots}</TableCell>
                      <TableCell>{row.TempInside}</TableCell>
                      <TableCell>{row.CO2Inside}</TableCell>
                      <TableCell>{row.HumidInside}</TableCell>
                      <TableCell>{row.TempOutside}</TableCell>
                      <TableCell>{row.CO2Outside}</TableCell>
                      <TableCell>{row.HumidOutside}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{row.Yield}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleDelete(row._id)}
                          size="small"
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { 
                              bgcolor: 'error.lighter' 
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PredictYield;