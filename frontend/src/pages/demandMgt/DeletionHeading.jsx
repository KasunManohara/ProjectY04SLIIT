import React from 'react';
import { Typography,Divider,Box } from "@mui/material";

const DeletionHeading = () => {
    return (

        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
           
          }}>
            Deletion Details
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>
      )
    }
    

export default DeletionHeading;
