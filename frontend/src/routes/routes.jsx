import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/dashboard/dashboard';
import ViewGrowShed from '../pages/growshedMgt/viewGrowShed';
import AddGrowShed from '../pages/growshedMgt/addGrowShed';
import Yield from '../pages/Yield/predictYield';
import Contamination from '../pages/contamination/contamination';
import RealTimeMonitor from '../pages/RealTimeMonitor/realTimeMonitor';
import ViewDemand from '../pages/demandMgt/ViewDemand';

const MRoutes = () => {
  return (
    
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/grow/growsheds" element={<ViewGrowShed />} />
        <Route path="/grow/addgrowshed" element={<AddGrowShed />} />
        <Route path="/grow/yield" element={<Yield />} />
        <Route path="/grow/contamination" element={<Contamination />} />
        <Route path="/realtime/monitor" element={<RealTimeMonitor/>}/>
        <Route path="/demand" element={<ViewDemand />} />
      </Routes>
    
  );
};

export default MRoutes;
