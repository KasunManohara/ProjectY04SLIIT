import {
  Box,
  Typography,
  Divider

} from '@mui/material';

import FetchData from './DataFetching/FetchData'

import Upload from './DataAdding/Upload';

function App() {
  return (
    <div className="App">
      <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
            mb: 1 
          }}>
            Contamination
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

      <Upload/>

      <br/>
      <FetchData/>
      
    </div>
  );
}

export default App;
