import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { useDrawingArea, useYScale } from '@mui/x-charts/hooks';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Styled components
const StyledPath = styled('path')(({ theme }) => ({
  fill: 'none',
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
  pointerEvents: 'none',
  strokeDasharray: '5 2',
}));

const StyledText = styled('text')(({ theme }) => ({
  stroke: 'none',
  fill: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

// ValueHighlight Component
function ValueHighlight({ svgRef }) {
  const { left, top, width, height } = useDrawingArea();
  const leftAxisScale = useYScale('left_axis_id');
  const rightAxisScale = useYScale('right_axis_id');

  const [mouseY, setMouseY] = useState(null);

  useEffect(() => {
    const element = svgRef.current;
    if (!element) return;

    const handleMouseOut = () => setMouseY(null);
    const handleMouseMove = (event) => {
      const x = event.offsetX;
      const y = event.offsetY;

      if (x < left || x > left + width || y < top - 10 || y > top + height + 10) {
        setMouseY(null);
        return;
      }
      setMouseY(Math.max(Math.min(top + height, y), top)); // clamp to the drawing area
    };

    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [height, left, top, width, svgRef]);

  if (mouseY === null) return null;

  return (
    <>
      <StyledPath d={`M ${left} ${mouseY} l ${width} 0`} />
      <StyledText x={left + 5} y={mouseY} textAnchor="start" dominantBaseline="text-after-edge">
        {leftAxisScale.invert(mouseY).toFixed(0)}
      </StyledText>
      <StyledText x={left + width - 5} y={mouseY} textAnchor="end" dominantBaseline="text-after-edge">
        {rightAxisScale.invert(mouseY).toFixed(0)}
      </StyledText>
    </>
  );
}

// Main Component
const ShopDemandVisualEight = () => {
  const svgRef = useRef(null);
  
  // State variables for current and predicted values
  const [currentValues, setCurrentValues] = useState(Array(7).fill(null));
  const [followingValues, setFollowingValues] = useState(Array(7).fill(null));
  
  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/get_predict_shop_demand_am");
        const data = await response.json();
        
        const currentSales = data.map(item => item.cy_yearly_sales).reverse();
        const followingSales = data.map(item => item.fy_yearly_sales).reverse();
        
        setCurrentValues(currentSales);
        setFollowingValues(followingSales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  return (
    <Container sx={{ bgcolor: '#E0DDDC', color: 'white', borderRadius: '16px', padding: '16px' }}>
      <Typography variant="h6" color="black">
        Yearly Sales Summary (AM)
      </Typography>

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', // Center horizontally
            alignItems: 'center',     // Center vertically
            height: 300 
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <ResponsiveChartContainer
          ref={svgRef}
          margin={{ top: 20, left: 50, right: 50, bottom: 30 }}
          height={300}
          series={[
            {
              type: 'line',
              data: currentValues,
              yAxisId: 'left_axis_id',
            },
            {
              type: 'line',
              data: followingValues,
              yAxisId: 'right_axis_id',
            },
          ]}
          xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7], scaleType: 'point' }]}
          yAxis={[
            { id: 'left_axis_id' },
            { id: 'right_axis_id' },
          ]}
        >
          <LinePlot />
          <ChartsYAxis position="left" axisId="left_axis_id" />
          <ChartsYAxis position="right" axisId="right_axis_id" />
          <ValueHighlight svgRef={svgRef} />
        </ResponsiveChartContainer>
      )}
    </Container>
  );
};

export default ShopDemandVisualEight;