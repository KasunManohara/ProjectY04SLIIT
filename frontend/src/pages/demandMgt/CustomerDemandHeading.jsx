import React from 'react';
import { Typography,Box,Divider } from "@mui/material";

const CustomerDemandHeading = () => {
  return (

    <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
           
          }}>
            Customer Details
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>
    
  )
}

export default CustomerDemandHeading;