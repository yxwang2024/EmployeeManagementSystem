import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper, Button, Stack } from "@mui/material";

import HrEmployeeProfilesTable from "../components/HrEmployeeProfilesTable";
import SearchBar from "../components/SearchBar";

import { updateSearchValue, triggerSearch } from "../store/slices/search.ts";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";

const HrEmployeeProfiles: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateSearchValue(""));
    dispatch(triggerSearch());
  }, []);

  return (
    <div className="employee-profiles md:pt-24">
      <Paper>
        <Stack direction="row" spacing={3}>
          <SearchBar></SearchBar>
        </Stack>
        <Box sx={{ my: 3 }}>
          <HrEmployeeProfilesTable></HrEmployeeProfilesTable>
        </Box>
      </Paper>
    </div>
  );
};

export default HrEmployeeProfiles;
