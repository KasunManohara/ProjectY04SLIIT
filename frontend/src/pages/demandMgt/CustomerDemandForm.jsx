import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

const districts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 
  'Trincomalee', 'Vavuniya'
];

const CustomerDemandForm = () => {
  const [district, setDistrict] = React.useState(null);
  const [memberCount, setMemberCount] = React.useState(null);

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleMemberCountChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^[1-9]*$/.test(value)) {
      setMemberCount(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Prepare data to be sent
    const districtCode = districts.indexOf(district);
    const data = { districtCode, memberCount: parseInt(memberCount) };

    try {
      const response = await fetch('/add_predict_customer_demand', {
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
      setDistrict(null);
      setMemberCount(null);

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
        <Box sx={{ m: 4, }}>
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
            <TextField
              id="member-count"
              label="Member Count"
              variant="outlined"
              value={memberCount}
              onChange={handleMemberCountChange}
              type="number"
              inputProps={{ min: "0", step: "1" }}
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

export default CustomerDemandForm;