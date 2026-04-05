import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useEmiContext } from '../context/EmiContext';
import './Header.css';

const Header = () => {
  const { calculatedValues } = useEmiContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadPDF = () => {
    window.print();
    handleClose();
  };

  const handleDownloadExcel = () => {
    if (!calculatedValues || !calculatedValues.schedule) return;
    const tableData = calculatedValues.schedule.map(row => ({
      Month: row.month,
      Date: row.date,
      Principal: row.principal.toFixed(2),
      Interest: row.interest.toFixed(2),
      Prepayment: row.prepayment.toFixed(2),
      Balance: row.balance.toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
    XLSX.writeFile(wb, 'emi_schedule.xlsx');
    handleClose();
  };

  return (
    <AppBar position="fixed" className="header-appbar">
      <Toolbar>
        <CalculateIcon className="header-icon" />
        <Typography variant="h6" component="div" className="header-title">
          <Link to="/" className="header-link">
            EMI Calculator
          </Link>
        </Typography>
        <Box className="header-actions">
          <Button color="inherit" onClick={handleClick} className="header-button">
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDownloadPDF}>Export PDF</MenuItem>
            <MenuItem onClick={handleDownloadExcel}>Export Excel</MenuItem>
          </Menu>
          <Typography variant="button">
            <Link to="/faq" className="header-link">
              FAQ
            </Link>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
