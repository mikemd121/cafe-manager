import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation, useParams } from 'react-router-dom';
import {  Box,Typography, Button, TextField, RadioGroup, Radio, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { fetchAllCafes } from '../../services/api';
import { useSelector,useDispatch } from 'react-redux';
import { clearSelectedEmployee } from '../../redux/slices/employeeSlice';

const AddEditEmployeePage = () => {
    const { id } = useParams(); // Get employee ID from the URL if in Edit mode
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const location = useLocation(); // To access the passed employee data from the state
    // const employeeFromState = location.state ? location.state.employee : null;
    const employeeFromState = useSelector((state) => state.employee.selectedEmployee);

  const [cafes, setCafes] = useState([]);
  const [employee, setEmployee] = useState({id:'', name: '', emailAddress: '', phoneNumber: '', gender: '', cafeId: '' });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    // Fetch cafes list
      fetchAllCafes().then(data => {
        setCafes(data);
      });
    
    if (employeeFromState) {
        setEmployee(employeeFromState); // Populate form with existing data
      }
    return () => {
      dispatch(clearSelectedEmployee()); // Clear selected cafe on unmount
    };
  }, [id,employeeFromState]);


  // const fetchEmployeeData = async (id) => {
  //   // Fetch employee data from your API (replace with actual API call)
  //   const response = await fetch(`/api/employees/${id}`);
  //   const data = await response.json();
  //   setEmployee(data);
  // };

  const validate = () => {
    let formErrors = {};
  
    // Validate Name: required and must be between 6 and 10 characters.
    if (!employee.name || employee.name.trim() === '') {
      formErrors.name = 'Name is required.';
    } else if (employee.name.trim().length < 6 || employee.name.trim().length > 10) {
      formErrors.name = 'Name must be between 6 and 10 characters.';
    }
  
    // Validate Email Address: required and must contain '@'.
    if (!employee.emailAddress || employee.emailAddress.trim() === '') {
      formErrors.emailAddress = 'Email address is required.';
    } else if (!employee.emailAddress.includes('@')) {
      formErrors.emailAddress = 'Invalid email address.';
    }
  
    // Validate Phone Number: required and must match Singapore phone pattern.
    if (!employee.phoneNumber || employee.phoneNumber.trim() === '') {
      formErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^[89]{1}[0-9]{7}$/.test(employee.phoneNumber)) {
      formErrors.phoneNumber = 'Phone number must start with 8 or 9 and have 8 digits.';
    }
  
    // Validate Assigned Café: required.
    if (!employee.cafeId) {
      formErrors.cafeId = 'Assigned Café is required.';
    }
  
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  

  const handleSubmit = () => {
     if (validate()) {
      const method = id ? 'PUT' : 'POST';
      const url = id ? ` https://localhost:44324/api/Employee` : ' https://localhost:44324/api/Employee';
      const body = id ? { ...employee, id: id,cafeId: employee.cafeId} : {...employee,cafeId: employee.cafeId};
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok) {
            navigate('/employees/:cafeId');
          }
        });
     }
  };
 
  return (
    <Box
      sx={{
        width: '100%', // full width
        height: '100vh', // full viewport height
        boxSizing: 'border-box',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // center vertically
        alignItems: 'center', // center horizontally
        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: 'white',
          borderRadius: 2,
          p: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {id ? 'Edit Employee' : 'Add Employee'}
        </Typography>

        <TextField
          label="Name"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email"
          value={employee.emailAddress}
          onChange={(e) => setEmployee({ ...employee, emailAddress: e.target.value })}
          error={!!errors.emailAddress}
          helperText={errors.emailAddress}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Phone Number"
          value={employee.phoneNumber}
          onChange={(e) => setEmployee({ ...employee, phoneNumber: e.target.value })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            value={employee.gender}
            onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Assigned Café</InputLabel>
          <Select
            value={employee.cafeId}
            onChange={(e) => setEmployee({ ...employee, cafeId: e.target.value })}
            label="Assigned Café"
            error={!!errors.cafeId}
          >
            {cafes.map((cafe) => (
              <MenuItem key={cafe.id} value={cafe.id}>
                {cafe.name}
              </MenuItem>
            ))}
          </Select>
          {errors.cafeId && (
            <Typography variant="caption" color="error">
              {errors.cafeId}
            </Typography>
          )}
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={() => navigate('/employees/:cafeId')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddEditEmployeePage;
