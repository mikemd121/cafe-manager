import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchEmployees, deleteEmployee } from '../../services/api';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { useDispatch } from 'react-redux';
import { setSelectedEmployee } from '../../redux/slices/employeeSlice';
import styles from './EmployeesPage.module.css'; // Import the CSS Module styles

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [cafeFilter, setCafeFilter] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Delete employee
  const handleDelete = () => {
    deleteEmployee(selectedEmployeeId).then(() => {
      setIsDeleteDialogOpen(false);
      fetchEmployees(cafeFilter).then(setEmployees); // Refresh employee list after deletion
    });
  };

  // Define columns for AgGrid
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
          <Button onClick={() => { setSelectedEmployeeId(params.data.id); setIsDeleteDialogOpen(true); }} color="error">
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Typography variant="h3" align="center" color="white" gutterBottom>
        Employees Manager
      </Typography>

      {/* Search and Actions */}
      <Box className={styles.searchBox}>
        <TextField
          label="Filter by Café"
          value={cafeFilter}
          onChange={(e) => setCafeFilter(e.target.value)}
          className={styles.textField}
        />
        <Box className={styles.buttonContainer}>
          <Button onClick={handleSearch} variant="contained" color="primary" className={styles.button}>
            Search
          </Button>
          <Button onClick={() => navigate("/employees/add")} variant="contained" color="secondary">
            Add New Employee
          </Button>
        </Box>
      </Box>

      {/* AG Grid */}
      <Box className={styles.gridBox}>
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
