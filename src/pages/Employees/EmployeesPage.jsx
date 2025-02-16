import React, { useState,useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchEmployees,fetchAllEmployees, deleteEmployee, fetchAllCafes } from '../../services/api';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { useDispatch } from 'react-redux';
import { setSelectedEmployee } from '../../redux/slices/employeeSlice';
import styles from './EmployeesPage.module.css'; // Import the CSS Module styles

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [cafeFilter, setCafeFilter] = useState('');
  const [deleteStatus, SetDeleteStatus] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {

    console.log('statusssssss  '  +deleteStatus)
    fetchAllEmployees()
      .then(setEmployees)
      .catch((error) => console.error('Error fetching cafes:', error));
  }, [deleteStatus]);

  // Fetch employees based on café filter
  const handleSearch = () => {
    fetchEmployees(cafeFilter)
      .then(setEmployees)
      .catch((error) => console.error('Error fetching employees:', error));
  };

  // Edit employee
  const handleEdit = (employee) => {
    dispatch(setSelectedEmployee(employee)); // Store employee in Redux
    navigate(`/employees/edit/${employee.id}`);
  };

  //Delete employee
  const handleDelete = () => {
    deleteEmployee(selectedEmployeeId).then(() => {
      setIsDeleteDialogOpen(false);
      SetDeleteStatus(true)
    //  fetchAllCafes().then(setEmployees); // Refresh employee list after deletion
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleSearch} variant="contained" color="primary" >
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
