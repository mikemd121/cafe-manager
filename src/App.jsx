// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CafesPage from './pages/Cafes/CafesPage';
import AddEditCafePage from './pages/Cafes/AddEditCafePage';
import EmployeesPage from './pages/Employees/EmployeesPage';
import AddEditEmployeePage from './pages/Employees/AddEditEmployeePage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      {/* You can pass a specific cafeId here */}
      <Navbar cafeId={1} />
      <Routes>
        {/* Home page which shows the list of Cafes */}
        <Route path="/" element={<CafesPage />} />

        {/* Add New Cafe page */}
        <Route path="/cafes/add" element={<AddEditCafePage />} />

        {/* Edit existing Cafe page */}
        <Route path="/cafes/edit/:id" element={<AddEditCafePage />} />

        {/* Employees list page for a specific cafe */}
        <Route path="/employees/:cafeId" element={<EmployeesPage />} />

      {/* Employees list page for a specific cafe */}
       <Route path="/employees/add" element={<AddEditEmployeePage />} />

       <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />


      </Routes>
    </Router>
  );
};

export default App;
