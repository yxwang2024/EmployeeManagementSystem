import React from 'react';

import {  Box,Paper } from '@mui/material';
import HrVisaStatusTable from '../components/HrVisaStatusTable';
import SearchBar from '../components/SearchBar';


const HrVisaStatusManagement: React.FC = () => {

  return (
    <div className="visa-status-management"> 
        <SearchBar></SearchBar>
        <Paper >
          <Box sx={{ my: 3 }}>
            <HrVisaStatusTable></HrVisaStatusTable>
          </Box>
        </Paper>
    </div>
  );
};

export default HrVisaStatusManagement;