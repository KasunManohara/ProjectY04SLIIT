import React from 'react';
import { Container } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const InformationViewOne = () => {
  
  const dataset = [
   {
      mushroom_id: '0',
      mushroom_name: 'American Oyster Mushroom (AOM)',
   },
   {
      mushroom_id: '1',
      mushroom_name: 'Button Mushroom (BM)',
   },
   {
      mushroom_id: '2',
      mushroom_name: 'Bhutan Oyster Mushroom (BOM)',
    },
    {
      mushroom_id: '3',
      mushroom_name: 'Pink Oyster Mushroom (POM)',
    },
    {
      mushroom_id: '4',
      mushroom_name: 'Abalone Mushroom (AM)',
    },
  ];
  
  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'white', borderRadius: '16px' }}>

        <PieChart
            series={[
                {
                    data: [
                        { id: dataset[0].mushroom_id, value: null, label: dataset[0].mushroom_name },
                        { id: dataset[1].mushroom_id, value: null, label: dataset[1].mushroom_name },
                        { id: dataset[2].mushroom_id, value: null, label: dataset[2].mushroom_name },
                        { id: dataset[3].mushroom_id, value: null, label: dataset[3].mushroom_name },
                        { id: dataset[4].mushroom_id, value: null, label: dataset[4].mushroom_name }
                    ],  
                },
            ]}
            margin={{ top: 0, bottom: 0, left: 0, right: 400 }}
            width={400}
            height={300}
        />
      
    </Container>
  )
}

export default InformationViewOne;