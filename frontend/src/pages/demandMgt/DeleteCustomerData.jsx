import React from 'react';
import Button from '@mui/material/Button';
import { Container, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const DeleteCustomerData = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState(null);

  const handleDelete = async () => {
    try {
      const response = await fetch('/delete_old_customer_demand_records', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDialogMessage(data.message);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error deleting records:', error);
      setDialogMessage('An error occurred while deleting data.');
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container
      sx={{
        bgcolor: '#E0DDDC',
        color: 'white',
        borderRadius: '16px',
        width: '550px',
        height: '200px',
        padding: '16px',
      }}
    >
      <Typography variant="h6" color="black">
        Keep the latest record and delete everything for Customer Data
      </Typography>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          sx={{
            width: '100px',
            bgcolor: 'red',
            '&:hover': { bgcolor: '#d32f2f' },
          }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Deletion Information</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeleteCustomerData;