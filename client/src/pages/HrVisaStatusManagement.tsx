import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Box, Paper,Button,Stack } from "@mui/material";
import HrVisaStatusTable from "../components/HrVisaStatusTable";
import SearchBar from "../components/SearchBar";
import {updateSearchValue, triggerSearch} from "../store/slices/search.ts";
import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import { toAllOption, toInProgressOption } from "../store/slices/option.ts";


const HrVisaStatusManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const option = useAppSelector((state) => state.option.value);
  const location = useLocation();

  useEffect(() => {
    console.log("Location changed:", location);
    dispatch(updateSearchValue(""));
    dispatch(triggerSearch());
  }, [option,location, dispatch]);

  return (
    <div className="visa-status-management md:pt-24">
      <Paper>
        <Stack direction="row" spacing={3}>
          <Button size="medium" variant={option === "InProgress" ? "outlined" : "contained"} onClick={() => {dispatch(toInProgressOption());}}>
            In Progress
          </Button>
          <Button size="medium" variant={option === "All" ? "outlined" : "contained"} onClick={() => {dispatch(toAllOption());}}>
            All
          </Button>
          {option == "All" && (
          <SearchBar></SearchBar>
          )}
        </Stack>
        <Box sx={{ my: 3 }}>
          <HrVisaStatusTable />
        </Box>
      </Paper>
    </div>
  );
};

export default HrVisaStatusManagement;
