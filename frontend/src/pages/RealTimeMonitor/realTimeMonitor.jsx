import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography,Box,Divider, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Droplets, Thermometer, Wind } from 'lucide-react';

const SensorDataDisplay = () => {
  const [sensorData, setSensorData] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorData(data);
      setChartData((prevData) => [
        ...prevData,
        { 
          name: new Date().toLocaleTimeString(), 
          humidity: data.humidity, 
          temperature: data.temperature, 
          co2Value: data.co2Value 
        },
      ]);
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
       <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
            mb: 1 
          }}>
            Real Time Monitor
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
                Sensor Readings
              </Typography>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Humidity Reading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(25, 118, 210, 0.1)', 
                    borderRadius: '50%', 
                    padding: '8px' 
                  }}>
                    <Droplets style={{ width: 24, height: 24, color: '#1976d2' }} />
                  </div>
                  <div>
                    <Typography color="text.secondary" variant="body2">
                      Humidity
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <Typography variant="h6">
                        {sensorData.humidity?.toFixed(1) || "0"}
                      </Typography>
                      <Typography color="text.secondary">%</Typography>
                    </div>
                  </div>
                </div>

                {/* Temperature Reading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(237, 108, 2, 0.1)', 
                    borderRadius: '50%', 
                    padding: '8px' 
                  }}>
                    <Thermometer style={{ width: 24, height: 24, color: '#ed6c02' }} />
                  </div>
                  <div>
                    <Typography color="text.secondary" variant="body2">
                      Temperature
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <Typography variant="h6">
                        {sensorData.temperature?.toFixed(1) || "0"}
                      </Typography>
                      <Typography color="text.secondary">°C</Typography>
                    </div>
                  </div>
                </div>

                {/* CO2 Reading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(46, 125, 50, 0.1)', 
                    borderRadius: '50%', 
                    padding: '8px' 
                  }}>
                    <Wind style={{ width: 24, height: 24, color: '#2e7d32' }} />
                  </div>
                  <div>
                    <Typography color="text.secondary" variant="body2">
                      CO₂ Level
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <Typography variant="h6">
                        {sensorData.co2Value?.toFixed(0) || "0"}
                      </Typography>
                      <Typography color="text.secondary">ppm</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
                Sensor Data Trends
              </Typography>
              
              <div style={{ height: '400px', width: '100%' }}>
                <LineChart
                  width={800}
                  height={400}
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#1976d2"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="Humidity (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ed6c02"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="Temperature (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="co2Value" 
                    stroke="#2e7d32"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="CO₂ (ppm)"
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SensorDataDisplay;