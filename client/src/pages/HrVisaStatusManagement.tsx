import axios from "axios";
import React, { useState, useEffect } from "react";
import { Box, Paper,Button,Stack } from "@mui/material";
import HrVisaStatusTable from "../components/HrVisaStatusTable";
import SearchBar from "../components/SearchBar";


const HrVisaStatusManagement: React.FC = () => {
  const [option, setOption] = useState("InProgress");
  return (
    <div className="visa-status-management md:pt-24">
      
      <Paper>
        <Stack direction="row" spacing={3}>
          <Button size="medium" variant={option === "InProgress" ? "outlined" : "contained"} onClick={() => setOption("InProgress")}>
            In Progress
          </Button>
          <Button size="medium" variant={option === "All" ? "outlined" : "contained"} onClick={() => setOption("All")}>
            All
          </Button>
          <SearchBar option={option}></SearchBar>
        </Stack>
        <Box sx={{ my: 3 }}>
          <HrVisaStatusTable option={option}></HrVisaStatusTable>
        </Box>
      </Paper>
    </div>
  );
};

export default HrVisaStatusManagement;
