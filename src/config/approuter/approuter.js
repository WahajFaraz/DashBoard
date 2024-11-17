// approuter/approuter.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../../pages/Login'; // Corrected path for Login
import SignUp from '../../pages/Signup'; // Corrected path and file name
import Dashboard from '../../dashboard/Dashboard'; // Corrected path for Dashboard

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SignUp />} />
        {/* Matches Signup file */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
