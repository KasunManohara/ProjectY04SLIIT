import React from 'react';
import { Container } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const InformationViewTwo = () => {
  
  const dataset = [
   {
      detail_id: '0',
      detail_name: 'Current Value',
   },
   {
      detail_id: '1',
      detail_name: 'Following Value',
   }
  ];
  
  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'white', borderRadius: '16px' }}>

        <PieChart
            series={[
                {
                    data: [
                        { id: dataset[0].detail_id, value: null, label: dataset[0].detail_name },
                        { id: dataset[1].detail_id, value: null, label: dataset[1].detail_name }
                    ],  
                },
            ]}
            margin={{ top: 0, bottom: 0, left: 0, right: 350 }}
            width={350}
            height={200}
        />
      
    </Container>
  )
}

export default InformationViewTwo;