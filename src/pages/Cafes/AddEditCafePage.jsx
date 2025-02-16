import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCafe, saveCafe } from '../../services/api';
import { clearSelectedCafe } from '../../redux/slices/cafeSlice';

const AddEditCafePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cafeFromState = useSelector((state) => state.cafe.selectedCafe);
  
  const [cafe, setCafe] = useState({ name: '', description: '', logo: '', location: '' });
  const [errors, setErrors] = useState({});

  // Populate form with existing cafe data (if available) on component mount
  useEffect(() => {
    if (cafeFromState) {
      setCafe(cafeFromState);
    }
    return () => {
      dispatch(clearSelectedCafe()); // Clear selected cafe on unmount
    };
  }, [cafeFromState, dispatch]);

  // Validation function for form inputs
  const validate = () => {
    let formErrors = {};

    // Name validation (required and length between 6 and 10 characters)
    if (!cafe.name.trim()) {
      formErrors.name = "Name is required.";
    } else if (cafe.name.trim().length < 6 || cafe.name.trim().length > 10) {
      formErrors.name = "Name must be between 6 and 10 characters.";
    }

    // Description validation (required and max 256 characters)
    if (!cafe.description.trim()) {
      formErrors.description = "Description is required.";
    } else if (cafe.description.trim().length > 256) {
      formErrors.description = "Description cannot exceed 256 characters.";
    }

    // Location validation (required)
    if (!cafe.location.trim()) {
      formErrors.location = "Location is required.";
    }

    // Logo validation (if provided)
    if (cafe.logo) {
      if (cafe.logo.size > 2 * 1024 * 1024) {
        formErrors.logo = "Logo file size cannot exceed 2MB.";
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(cafe.logo.type)) {
        formErrors.logo = "Logo must be an image (jpeg, png, or gif).";
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validate()) {
      saveCafe(cafe, id).then(() => navigate('/'));
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
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
          {id ? 'Edit Café' : 'Add New Café'}
        </Typography>

        {/* Name Input */}
        <TextField
          label="Name"
          value={cafe.name}
          onChange={(e) => setCafe({ ...cafe, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          margin="normal"
        />

        {/* Description Input */}
        <TextField
          label="Description"
          value={cafe.description}
          onChange={(e) => setCafe({ ...cafe, description: e.target.value })}
          error={!!errors.description}
          helperText={errors.description}
          fullWidth
          margin="normal"
        />

        {/* Logo Upload */}
        <Box component="div" sx={{ my: 2 }}>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setCafe({ ...cafe, logo: e.target.files[0] });
              }
            }}
          />
          {errors.logo && <Typography variant="caption" color="error">{errors.logo}</Typography>}
        </Box>

        {/* Location Input */}
        <TextField
          label="Location"
          value={cafe.location}
          onChange={(e) => setCafe({ ...cafe, location: e.target.value })}
          error={!!errors.location}
          helperText={errors.location}
          fullWidth
          margin="normal"
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddEditCafePage;
