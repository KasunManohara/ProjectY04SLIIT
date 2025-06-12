import React from 'react';
import { Typography,Divider,Box } from "@mui/material";

const ShopDemandHeadingTwo = () => {
  return (

    <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
           
          }}>
             Shop Details - 02
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>
  )
}

export default ShopDemandHeadingTwo;