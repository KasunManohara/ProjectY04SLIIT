import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const ShopDemandVisualFive = () => {
  // State variables for yearly sales
  const [currentValueYearly, setCurrentValueYearly] = useState(null);
  const [followingValueYearly, setFollowingValueYearly] = useState(null);

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Fetch sales data on component mount
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/get_predict_shop_demand_aom");
        const data = await response.json();
        
        // Update state with fetched data
        setCurrentValueYearly(data[0].cy_yearly_sales);
        setFollowingValueYearly(data[0].fy_yearly_sales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSalesData();
  }, []); // Dependency array ensures this runs once on mount

  const yearlyData = [
    { label: 'Current Year Yearly Sales (AOM)', value: currentValueYearly },
    { label: 'Following Year Yearly Sales (AOM)', value: followingValueYearly }
  ];

  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'black', borderRadius: '16px', padding: '16px' }}>
      <Typography variant="h6" color="black">
        Latest Yearly Sales Summary (AOM)
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
        <PieChart
          series={[
            {
              paddingAngle: 5,
              innerRadius: 60,
              outerRadius: 80,
              data: yearlyData,
            },
          ]}
          margin={{ right: 5 }}
          width={500}
          height={300}
          legend={{ hidden: true }}
        />
      )}
    </Container>
  );
}

export default ShopDemandVisualFive;