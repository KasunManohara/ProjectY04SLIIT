import React from 'react';
import { Typography,Divider,Box } from "@mui/material";

const ShopDemandHeadingOne = () => {
  return (

    <Box sx={{ textAlign: 'left' }}>
    <Typography variant="h4" sx={{ 
      fontWeight: 600, 
      color: 'primary.main',
     
    }}>
      Shop Details - 01
    </Typography>
    <Divider sx={{ mb: 4 }} />
  </Box>
  )
}

export default ShopDemandHeadingOne;