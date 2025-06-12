import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ShopDemandVisualSix = () => {
  // State for current and following values
  const [currentValues, setCurrentValues] = useState(Array(7).fill(null));
  const [followingValues, setFollowingValues] = useState(Array(7).fill(null));
  
  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/get_predict_shop_demand_am");
        const data = await response.json();
        
        // Update state with fetched data in reverse order
        const current = data.map(item => item.c_daily_sales).reverse();
        const following = data.map(item => item.fy_daily_sales).reverse();

        setCurrentValues(current);
        setFollowingValues(following);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []); // Runs once on mount

  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'black', borderRadius: '16px', padding: '16px' }}>
      <Typography variant="h6" color="black">
        Daily Sales Summary (AM)
      </Typography>

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', // Center horizontally
            alignItems: 'center',     // Center vertically
            width: 500, 
            height: 300 
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <LineChart
          xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7], label: 'Day Number (Latest details in day number 7th)' }]}
          series={[
            {
              name: 'Series 1 - Current',
              data: currentValues,
            },
            {
              name: 'Series 2 - Predicted',
              data: followingValues,
            },
          ]}
          width={500}
          height={300}
        />
      )}
    </Container>
  );
};

export default ShopDemandVisualSix;
