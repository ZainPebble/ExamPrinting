import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/admin-page';
import OfficerDashboard from './pages/officer-page';
import TechDashboard from './pages/tech-page';
import PrintForm from './pages/print';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/tech" element={<TechDashboard />} />
        <Route path="/print/:subjectId" element={<PrintForm />} />
      </Routes>
    </Router>
  );
};

export default App;
