import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const ShopDemandVisualFourteen = () => {
  const [salesData, setSalesData] = useState(Array(7).fill({
    districtName: null,
    currentDailyValue: null,
    followingDailyValue: null,
  }));
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch sales data on component mount
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/get_predict_shop_demand_district_am");
        const data = await response.json();
        
        // Map the fetched data to our state structure
        const formattedData = data.map((item) => ({
          districtName: item.district_name,
          currentDailyValue: item.c_daily_sales,
          followingDailyValue: item.fy_daily_sales,
        }));
        
        setSalesData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSalesData();
  }, []);
  
  // Translations for labels
  const translations = {
    currentDailyValue: 'Current Year Daily Sales',
    followingDailyValue: 'Following Year Daily Sales'
  };

  // Function to add labels to the series
  function addLabels(series) {
    return series.map((item) => ({
      ...item,
      label: translations[item.dataKey],
      valueFormatter: (v) => (v ? `${v.toLocaleString()} packets` : '-'),
    }));
  }

  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'black', borderRadius: '16px', padding: '16px' }}>
      <Typography variant="h6" color="black">
        District Wise Daily Sales (AM)
      </Typography>

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: 500,
            height: 300,
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <BarChart
          dataset={salesData} // Updated to salesData
          series={addLabels([
            { dataKey: 'followingDailyValue', stack: 'stk1' },
            { dataKey: 'currentDailyValue', stack: 'stk1' }
          ])}
          xAxis={[{
            scaleType: 'band',
            dataKey: 'districtName',
            tickLabelPlacement: 'middle',
            tickLabelStyle: { angle: -90, textAlign: 'end', opacity: 0 }
          }]}
          slotProps={{ legend: { hidden: false } }}
          width={500}
          height={300}
        />
      )}
    </Container>
  );
}

export default ShopDemandVisualFourteen;
