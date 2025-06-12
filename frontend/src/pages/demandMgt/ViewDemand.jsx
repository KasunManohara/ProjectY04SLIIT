import React from 'react';
import { Box, Container, Grid, Card, Stack } from '@mui/material';
import CustomerDemandHeading from './CustomerDemandHeading';
import CustomerDemandVisualOne from './CustomerDemandVisualOne';
import InformationViewOne from './InformationViewOne';
import CustomerDemandForm from './CustomerDemandForm';
import ShopDemandHeadingOne from './ShopDemandHeadingOne';
import ShopDemandForm from './ShopDemandForm';
import InformationViewTwo from './InformationViewTwo';
import ShopDemandVisualOne from './ShopDemandVisualOne';
import ShopDemandVisualTwo from './ShopDemandVisualTwo';
import ShopDemandVisualThree from './ShopDemandVisualThree';
import ShopDemandVisualFour from './ShopDemandVisualFour';
import ShopDemandVisualFive from './ShopDemandVisualFive';
import ShopDemandVisualSix from './ShopDemandVisualSix';
import ShopDemandVisualSeven from './ShopDemandVisualSeven';
import ShopDemandVisualEight from './ShopDemandVisualEight';
import ShopDemandVisualNine from './ShopDemandVisualNine';
import ShopDemandVisualTen from './ShopDemandVisualTen';
import DeleteCustomerData from './DeleteCustomerData';
import DeleteShopDataAom from './DeleteShopDataAom';
import DeletionHeading from './DeletionHeading';
import DeleteShopDataAm from './DeleteShopDataAm';
import ShopDemandHeadingTwo from './ShopDemandHeadingTwo';
import ShopDemandVisualEleven from './ShopDemandVisualEleven';
import ShopDemandVisualTwelve from './ShopDemandVisualTwelve';
import ShopDemandVisualThirteen from './ShopDemandVisualThirteen';
import ShopDemandVisualFourteen from './ShopDemandVisualFourteen';

const ViewDemand = () => {
  // Modern card styles
  const cardStyle = {
    p: 3,
    boxShadow: 2,
    transition: 'box-shadow 0.3s, transform 0.3s',
    '&:hover': {
      boxShadow: 6,
      transform: 'scale(1.02)',
    },
    borderRadius: 2,
  };

  return (
    <Container maxWidth="xl" >
      <Stack spacing={6}>
        {/* Customer Demand Section */}
        <Box component="section" sx={{ mb: 5 }}>
          <Card sx={{ mb: 3, p: 3 }}>
            <CustomerDemandHeading />
          </Card>
          <Card sx={{ ...cardStyle, mb: 5, p: 4 }}>
            <Stack spacing={4}>
              <CustomerDemandVisualOne />
              <InformationViewOne />
              <CustomerDemandForm />
            </Stack>
          </Card>
        </Box>

        {/* Shop Demand Section */}
        <Box component="section" sx={{ mb: 5 }}>
          <Card sx={{ mb: 3, p: 3 }}>
            <ShopDemandHeadingOne />
          </Card>
          <Card sx={{ ...cardStyle, p: 4 }}>
            <Stack spacing={4}>
              <ShopDemandForm />
              <InformationViewTwo />
            </Stack>
          </Card>
        </Box>

        {/* Shop Demand Visuals Grid */}
        <Box component="section" sx={{ mb: 5 }}>
          <Grid container spacing={3}>
            {[
              ShopDemandVisualOne,
              ShopDemandVisualTwo,
              ShopDemandVisualThree,
              ShopDemandVisualFour,
              ShopDemandVisualFive,
              ShopDemandVisualSix,
              ShopDemandVisualSeven,
              ShopDemandVisualEight,
              ShopDemandVisualNine,
              ShopDemandVisualTen,
            ].map((Component, index) => (
              <Grid item xs={6}key={index}>
                <Card sx={cardStyle}>
                  <Component />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Deletion Section */}
        <Box component="section" sx={{ mb: 5 }}>
          <Card sx={{  mb: 3, p: 3 }}>
            <DeletionHeading />
          </Card>
          <Card sx={{ ...cardStyle, p: 4 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DeleteCustomerData />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DeleteShopDataAom />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DeleteShopDataAm />
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Box>

        {/* Additional Shop Demand Section */}
        <Box component="section" sx={{ mb: 5 }}>
          <Card sx={{ mb: 3, p: 3 }}>
            <ShopDemandHeadingTwo />
          </Card>
          <Grid container spacing={3}>
            {[
              ShopDemandVisualEleven,
              ShopDemandVisualTwelve,
              ShopDemandVisualThirteen,
              ShopDemandVisualFourteen,
            ].map((Component, index) => (
              <Grid item xs={6} key={index}>
                <Card sx={cardStyle}>
                  <Component />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default ViewDemand;
