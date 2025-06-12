import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ShopDemandVisualSeven = () => {
  // State for daily and monthly sales values
  const [salesData, setSalesData] = useState(Array(7).fill({
    currentDailyValue: null,
    currentValue: null,
    followingValue: null,
  }));

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Fetch sales data on component mount
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/get_predict_shop_demand_am");
        const data = await response.json();
        
        // Map the fetched data to our state structure
        const formattedData = data.map(item => ({
          currentValue: item.cy_monthly_sales,
          followingValue: item.fy_monthly_sales,
        })).reverse();
        
        setSalesData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSalesData();
  }, []);

  // Prepare data for the ScatterChart
  const chartData = salesData.map((sales, index) => ({
    id: index + 1,
    cy_monthly_sales: sales.currentValue,
    fy_monthly_sales: sales.followingValue,
  }));

  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'white', borderRadius: '16px', padding: '16px' }}>
      <Typography variant="h6" color="black">
        Monthly Sales Summary (AM)
      </Typography>

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', // Center horizontally
            alignItems: 'center',     // Center vertically
            width: '100%', 
            height: 300 
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <ScatterChart
          series={[
            {
              label: 'Current Value',
              data: chartData.map(v => ({ x: v.id, y: v.cy_monthly_sales, id: v.id })),
            },
            {
              label: 'Following Value',
              data: chartData.map(v => ({ x: v.id, y: v.fy_monthly_sales, id: v.id })),
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          width={500}
          height={300}
        />
      )}
    </Container>
  );
};

export default ShopDemandVisualSeven;
