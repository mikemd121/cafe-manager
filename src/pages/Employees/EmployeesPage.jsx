import React, { useState, useEffect } from 'react';
import {Box,Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchEmployees, deleteEmployee } from '../../services/api';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { setSelectedEmployee } from '../../redux/slices/employeeSlice';
import {useDispatch } from 'react-redux';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [cafeFilter, setCafeFilter] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   // Fetch cafes list
  //   fetchCafes();
  //   if (employeeFromState) {
  //       setEmployee(employeeFromState); // Populate form with existing data
  //     }
  // }, [id, employeeFromState]);

  // Fetch employees with café filter


  const handleSearch = () => {
    fetchEmployees(cafeFilter)
       .then(data => {
         console.log(data); // Log the fetched data
         setEmployees(data);
       })
       .catch(error => {
         console.error('Error fetching cafes:', error); // Handle fetch errors
       });
   
  };

  const handleEdit = (employee) => {
    dispatch(setSelectedEmployee(employee));  // Store cafe in Redux
    // Navigate to the Edit page and pass the employee data via state
    navigate(`/employees/edit/${employee.id}`);
  };

  const handleDelete = () => {
    deleteEmployee(selectedEmployeeId).then(() => {
      setIsDeleteDialogOpen(false);
      fetchEmployees(cafeFilter).then(data => setEmployees(data)); // Refresh after delete
    });
  };

  const columns = [
    { field: 'id', headerName: 'Employee ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'emailAddress', headerName: 'Email' },
    { field: 'phoneNumber', headerName: 'Phone Number' },
    { field: 'daysWorked', headerName: 'Days Worked' },
    { field: 'cafe', headerName: 'Café Name' },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <>
          <Button onClick={() => handleEdit(params.data)}>Edit</Button>
          <Button 
            onClick={() => { setSelectedEmployeeId(params.data.id); setIsDeleteDialogOpen(true); }} 
            color="error"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',            // Use 100% width of the parent container (viewport)
        height: '100vh',          // Full viewport height
        boxSizing: 'border-box',
        overflowX: 'hidden',      // Prevent horizontal scrolling
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
        p: 2,
      }}
    >
      {/* Header */}
      <Typography variant="h3" align="center" color="white" gutterBottom>
        Employees Manager
      </Typography>

      {/* Search and Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <TextField
          label="Filter by Café"
          value={cafeFilter}
          onChange={(e) => setCafeFilter(e.target.value)}
          sx={{ backgroundColor: 'white', borderRadius: 1, mr: 1, mb: { xs: 1, sm: 0 } }}
        />
        <Box>
          <Button onClick={handleSearch} variant="contained" color="primary" sx={{ mr: 1 }}>
            Search
          </Button>
          <Button onClick={() => navigate("/employees/add")} variant="contained" color="secondary">
            Add New Employee
          </Button>
        </Box>
      </Box>

      {/* AG Grid Container fills remaining space */}
      <Box
        className="ag-theme-alpine"
        sx={{
          flex: 1,
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 1,
          p: 1,
          overflow: 'auto',
        }}
      >
        <AgGridReact
          rowData={employees}
          columnDefs={columns}
          pagination
          getRowNodeId={(data) => data.id}
          modules={[ClientSideRowModelModule]}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeesPage;
