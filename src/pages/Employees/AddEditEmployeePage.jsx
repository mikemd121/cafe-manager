import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography as MuiTypography } from '@mui/material';
import { fetchAllCafes, saveEmployee } from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedEmployee } from '../../redux/slices/employeeSlice';

const AddEditEmployeePage = () => {
  const { id } = useParams(); // Get employee ID from the URL (Edit mode)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get employee data from Redux store if editing an employee
  const employeeFromState = useSelector((state) => state.employee.selectedEmployee);

  const [cafes, setCafes] = useState([]);
  const [employee, setEmployee] = useState({
    id: '',
    name: '',
    emailAddress: '',
    phoneNumber: '',
    gender: '',
    cafeId: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch cafes data and populate the form if editing an existing employee
  useEffect(() => {
    // Fetch cafes list
    fetchAllCafes().then(setCafes);
    
    if (employeeFromState) {
      setEmployee(employeeFromState); // Populate form with existing employee data
    }

    // Cleanup selected employee data on unmount
    return () => {
      dispatch(clearSelectedEmployee());
    };
  }, [employeeFromState, dispatch]);

  // Validation function for form fields
  const validate = () => {
    const formErrors = {};

    // Name validation (required and between 6 and 10 characters)
    if (!employee.name.trim()) {
      formErrors.name = 'Name is required.';
    } else if (employee.name.trim().length < 6 || employee.name.trim().length > 10) {
      formErrors.name = 'Name must be between 6 and 10 characters.';
    }

    // Email validation (required and must contain '@')
    if (!employee.emailAddress.trim()) {
      formErrors.emailAddress = 'Email address is required.';
    } else if (!employee.emailAddress.includes('@')) {
      formErrors.emailAddress = 'Invalid email address.';
    }

    // Phone validation (required and match Singapore phone pattern)
    if (!employee.phoneNumber.trim()) {
      formErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^[89]{1}[0-9]{7}$/.test(employee.phoneNumber)) {
      formErrors.phoneNumber = 'Phone number must start with 8 or 9 and have 8 digits.';
    }

    // Assigned Café validation (required)
    if (!employee.cafeId) {
      formErrors.cafeId = 'Assigned Café is required.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Submit form data (add or edit employee)
  const handleSubmit = () => {
    if (validate()) {
      saveEmployee(employee, id).then(() => navigate('/employees/:cafeId'));
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
        p: 2,
        boxSizing: 'border-box',
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

        {/* Employee Name Input */}
        <TextField
          label="Name"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          margin="normal"
        />

        {/* Employee Email Input */}
        <TextField
          label="Email"
          value={employee.emailAddress}
          onChange={(e) => setEmployee({ ...employee, emailAddress: e.target.value })}
          error={!!errors.emailAddress}
          helperText={errors.emailAddress}
          fullWidth
          margin="normal"
        />

        {/* Employee Phone Number Input */}
        <TextField
          label="Phone Number"
          value={employee.phoneNumber}
          onChange={(e) => setEmployee({ ...employee, phoneNumber: e.target.value })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          fullWidth
          margin="normal"
        />

        {/* Gender Select */}
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

        {/* Assigned Café Select */}
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
            <MuiTypography variant="caption" color="error">
              {errors.cafeId}
            </MuiTypography>
          )}
        </FormControl>

        {/* Form Action Buttons */}
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
