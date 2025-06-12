import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const ShopDemandVisualNine = () => {
  // State variables for daily and monthly sales
  const [currentValueDaily, setCurrentValueDaily] = useState(null);
  const [followingValueDaily, setFollowingValueDaily] = useState(null);
  const [currentValueMonthly, setCurrentValueMonthly] = useState(null);
  const [followingValueMonthly, setFollowingValueMonthly] = useState(null);

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Fetch sales data on component mount
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/get_predict_shop_demand_am");
        const data = await response.json();
        
        // Update state with fetched data
        setCurrentValueDaily(data[0].c_daily_sales);
        setFollowingValueDaily(data[0].fy_daily_sales);
        setCurrentValueMonthly(data[0].cy_monthly_sales);
        setFollowingValueMonthly(data[0].fy_monthly_sales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSalesData();
  }, []); // Dependency array ensures this runs once on mount

  // Data for PieChart
  const dailyData = [
    { label: 'Current Year Daily Sales (AM)', value: currentValueDaily },
    { label: 'Following Year Daily Sales (AM)', value: followingValueDaily },
  ];

  const monthlyData = [
    { label: 'Current Year Monthly Sales (AM)', value: currentValueMonthly },
    { label: 'Following Year Monthly Sales (AM)', value: followingValueMonthly },
  ];

  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'black', borderRadius: '16px', padding: '16px' }}>
      <Typography variant="h6" color="black">
        Latest Daily And Monthly Sales Summary (AM)
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
              innerRadius: 0,
              outerRadius: 80,
              data: dailyData,
            },
            {
              innerRadius: 100,
              outerRadius: 120,
              data: monthlyData,
            }
          ]}
          width={500}   // Set width for PieChart
          height={300}  // Set height for PieChart
          slotProps={{
            legend: { hidden: true },
          }}
          margin={{ left: 80 }} // Add left margin here
        />
      )}
    </Container>
  );
}

export default ShopDemandVisualNine;
