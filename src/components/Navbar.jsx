// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Cafe Employee Manager
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Cafes
        </Button>
        {/* For testing, pass a specific cafeId */}
        <Button color="inherit" component={Link} to="/employees/1">
          Employees
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
