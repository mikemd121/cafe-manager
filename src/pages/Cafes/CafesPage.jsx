import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { deleteCafe, fetchAllCafes, fetchCafes } from '../../services/api';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { useDispatch } from 'react-redux';
import { setSelectedCafe } from '../../redux/slices/cafeSlice';

const CafesPage = () => {
  const [cafes, setCafes] = useState([]);
  const [filter, setFilter] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const [deleteStatus, SetDeleteStatus] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllCafes()
      .then((setCafes))
      .catch((error) => console.error('Error fetching cafes:', error));

  }, [deleteStatus]);

  // Handle search
  const handleSearch = () => {
    fetchCafes(filter)
      .then(setCafes)
      .catch((error) => console.error('Error fetching cafes:', error));
  };

  const handleEdit = (cafe) => {
    dispatch(setSelectedCafe(cafe)); // Store cafe in Redux
    navigate(`/cafes/edit/${cafe.id}`); // Navigate without passing state
  };

  // Handle deletion and refresh grid
  const handleDelete = () => {
    deleteCafe(selectedCafeId)
      .then(() => {
        setIsDeleteDialogOpen(false);
        SetDeleteStatus(true)
      })
  };

  // Define columns for AgGrid
  const columns = [
    {
      field: 'logo',
      headerName: 'Logo',
      cellRenderer: (params) => {
        const logo = params.value;
        return logo ? <img src={`data:image/png;base64,${logo}`} alt="Logo" width={50} /> : <span>No Logo</span>;
    },
    },
    {
      field: 'name',
      headerName: 'Name',
      cellRenderer: (params) => <span>{params.value || 'No Name'}</span>,
    },
    {
      field: 'description',
      headerName: 'Description',
      cellRenderer: (params) => <span>{params.value || 'No Description'}</span>,
    },
    {
      field: 'employees',
      headerName: 'Employees',
      cellRenderer: (params) => <span>{params.value ?? 0}</span>,
    },
    {
      field: 'location',
      headerName: 'Location',
      cellRenderer: (params) => <span>{params.value || 'No Location'}</span>,
    },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <>
          <Button onClick={() => handleEdit(params.data)}>Edit</Button>
          <Button onClick={() => { setSelectedCafeId(params.data.id); setIsDeleteDialogOpen(true); }} color="error">
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: '100vh', boxSizing: 'border-box', overflowX: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)', p: 2 }}>
      {/* Header */}
      <Typography variant="h3" align="center" color="white" gutterBottom>
        Cafe Manager
      </Typography>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
        <TextField 
          label="Filter by Location" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          sx={{ backgroundColor: 'white', borderRadius: 1, mr: 1, mb: { xs: 1, sm: 0 } }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleSearch} variant="contained" color="primary">
            Search
          </Button>
          <Button onClick={() => navigate("/cafes/add")} variant="contained" color="secondary">
            Add New Cafe
          </Button>
        </Box>
      </Box>

      {/* AG Grid */}
      <Box className="ag-theme-alpine" sx={{ flex: 1, width: '100%', backgroundColor: 'white', borderRadius: 1, p: 1, overflow: 'auto' }}>
        <AgGridReact rowData={cafes} columnDefs={columns} pagination getRowNodeId={(data) => data.id} modules={[ClientSideRowModelModule]} />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this cafe?</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CafesPage;
