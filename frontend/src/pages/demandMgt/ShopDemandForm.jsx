import * as React from 'react';
import { Container, Box, Button, InputLabel, MenuItem, FormControl, Select, TextField } from '@mui/material';

const districts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 
  'Trincomalee', 'Vavuniya'
];

const mushrooms = [
  'American Oyster Mushroom (AOM)', 
  'Button Mushroom (BM)', 
  'Bhutan Oyster Mushroom (BOM)', 
  'Pink Oyster Mushroom (POM)', 
  'Abalone Mushroom (AM)'
];

const sales_growth_choice = [
  'Yes', 
  'No'
];

const ShopDemandForm = () => {
  const [mushroomType, setMushroomType] = React.useState(null);
  const [district, setDistrict] = React.useState(null);
  const [expectDailySalesGrowthChoice, setExpectDailySalesGrowthChoice] = React.useState(null);
  const [demandAmount, setDemandAmount] = React.useState(null);

  const [mushroomCode, setMushroomCode] = React.useState(null);
  const [districtCode, setDistrictCode] = React.useState(null);
  const [observedDailySales, setObservedDailySales] = React.useState(null);
  const [expectDailySalesGrowth, setExpectDailySalesGrowth] = React.useState(null);

  const handleMushroomTypeChange = (event) => {
    const selectedMushroomType = event.target.value;
    setMushroomType(selectedMushroomType);
    setMushroomCode(mushrooms.indexOf(selectedMushroomType));
  };

  const handleDistrictChange = (event) => {
    const selectedDistrict = event.target.value;
    setDistrict(selectedDistrict);
    setDistrictCode(districts.indexOf(selectedDistrict));
  };

  const handleDemandAmountChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^[1-9]*$/.test(value)) {
      setDemandAmount(value);
      setObservedDailySales(parseInt(value) || null); // Update observed daily sales based on demand amount
    }
  };

  const handleExpectDailySalesGrowthChoice = (event) => {
    const choice = event.target.value;
    setExpectDailySalesGrowthChoice(choice);
    setExpectDailySalesGrowth(sales_growth_choice.indexOf(choice));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Prepare data to be sent
    const data = { mushroomCode, districtCode, observedDailySales, expectDailySalesGrowth };

    try {
      const response = await fetch('/add_predict_shop_demand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      
      // Reset form fields
      setMushroomType(null);
      setDistrict(null);
      setExpectDailySalesGrowthChoice(null);
      setDemandAmount(null);
      setMushroomCode(null);
      setDistrictCode(null);
      setObservedDailySales(null);
      setExpectDailySalesGrowth(null);

      // Refresh the page after successful submission
      if(result)
        window.location.reload();
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'white', borderRadius: '16px',  padding: '16px',justifyContent:'left' }} fixed>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ m: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="mushroom-type-select-label">Mushroom Type</InputLabel>
            <Select
              labelId="mushroom-type-select-label"
              id="mushroom-type-select"
              value={mushroomType}
              label="Mushroom Type"
              onChange={handleMushroomTypeChange}
            >
              {mushrooms.filter(mushroomName => mushroomName === "American Oyster Mushroom (AOM)" || mushroomName === "Abalone Mushroom (AM)").map((mushroomName, index) => (
                <MenuItem key={index} value={mushroomName}>{mushroomName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ m: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="district-select-label">District</InputLabel>
            <Select
              labelId="district-select-label"
              id="district-select"
              value={district}
              label="District"
              onChange={handleDistrictChange}
            >
              {districts.map((districtName, index) => (
                <MenuItem key={index} value={districtName}>{districtName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ m: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="expect_daily-sales-growth-select-label">Expect Daily Sales Growth</InputLabel>
            <Select
              labelId="expect_daily-sales-growth-select-label"
              id="expect_daily-sales-growth-select"
              value={expectDailySalesGrowthChoice}
              label="Expect Daily Sales Growth"
              onChange={handleExpectDailySalesGrowthChoice}
            >
              {sales_growth_choice.map((choice, index) => (
                <MenuItem key={index} value={choice}>{choice}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ m: 4 }}>
          <FormControl fullWidth>
            <TextField
              id="demand-amount"
              label="Daily Sales (Packets)"
              variant="outlined"
              value={demandAmount}
              onChange={handleDemandAmountChange}
              type="number"
              inputProps={{ min: "0", step: "1" }} // Ensure the input is non-negative
            />
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Button type="submit" variant="contained" style={{ width: '210px' }}>
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ShopDemandForm;