import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function BasicTable() {
  const [contamiData, setContamiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContamiData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:4085/get_pot_data");
      const data = await response.json();

      const formattedData = data.map((item) => ({
        Id: item._id,
        RackNumber: item.Racknumber,
        CurrentState: item.State,
        AffectedImageUrl: item.Affected_Image_Url,
        GoodImageUrl: item.Good_Image_Url,
        ImageDate: item.Image_Date
      })).reverse();

      setContamiData(formattedData);
    } catch (error) {
      console.error("Error fetching contamination data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContamiData();
    const intervalId = setInterval(fetchContamiData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleButtonClick = async (row) => {
    const dataToSend = {
      Id: row.Id,
      AffectedImageUrl: row.AffectedImageUrl,
      GoodImageUrl: row.GoodImageUrl,
    };

    try {
      const response = await fetch('http://127.0.0.1:4085/delete_pot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Response from server:', responseData);
      fetchContamiData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const getStateColor = (state) => {
    switch (state?.toLowerCase()) {
      case 'good':
        return 'success';
      case 'affected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Contamination Data
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton 
            onClick={fetchContamiData}
            sx={{
              '&:hover': {
                bgcolor: 'primary.soft',
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 2,
          borderRadius: 2,
          overflow: 'hidden',
          mr:'20px'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.neutral' }}>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  py: 2
                }}
              >
                Image Date
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  py: 2
                }}
              >
                Rack Number
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  py: 2
                }}
              >
                Current State
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  py: 2
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contamiData.map((row) => (
              <TableRow
                key={row.Id}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'background-color 0.2s ease',
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">
                    {new Date(row.ImageDate).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">
                    {row.RackNumber}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    label={row.CurrentState}
                    color={getStateColor(row.CurrentState)}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      borderRadius: 1,
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Tooltip title="Delete entry">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleButtonClick(row)}
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'error.soft',
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}