import React from 'react';
import AppDrawer from './components/sidebar/appdrawer';
import MRoutes from './routes/routes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
    <AppDrawer>
      <MRoutes />
    </AppDrawer>
    </Router>
  );
};

export default App;
