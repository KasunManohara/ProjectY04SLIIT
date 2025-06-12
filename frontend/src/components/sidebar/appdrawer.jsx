import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  ListItemButton
} from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const AppDrawer = ({ children }) => {
  const menuItems = [
    // { text: 'Add Growshed', path: '/grow/addgrowshed' },
    // { text: 'Manage Growsheds', path: '/grow/growsheds' },
    { text: 'Yield', path: '/grow/yield' },
    { text: 'Contamination', path: '/grow/contamination' },
    { text: 'RealTime Monitor', path: '/realtime/monitor' },
    { text: 'Demand', path: '/demand' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderTopRightRadius:'20px',
            borderBottomRightRadius:'20px',
            // backgroundColor:'#091057',
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'primary.contrastText',
              fontWeight: 'bold',
              fontFamily:'monospace',
              letterSpacing: '0.5px'
            }}
          >
            MushroomMatrix
          </Typography>
        </Box>
        
        <Divider />
        
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&.active': {
                    bgcolor: 'action.selected',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }
                }}
              >
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'text.primary'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppDrawer;