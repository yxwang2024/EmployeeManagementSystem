import axios from "axios";
import React, { useState, useEffect } from "react";
import { Box, Paper,Button,Stack } from "@mui/material";
import HrVisaStatusTable from "../components/HrVisaStatusTable";
import SearchBar from "../components/SearchBar";
import {updateSearchValue, triggerSearch} from "../store/slices/search.ts";
import {useAppDispatch, useAppSelector} from "../store/hooks.ts";


const HrVisaStatusManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const [option, setOption] = useState("InProgress");

  useEffect(() => {
    dispatch(updateSearchValue(""));
    dispatch(triggerSearch());
  }, [option]);

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
          {option == "All" && (
          <SearchBar option={option}></SearchBar>
          )}
        </Stack>
        <Box sx={{ my: 3 }}>
          <HrVisaStatusTable option={option}></HrVisaStatusTable>
        </Box>
      </Paper>
    </div>
  );
};

export default HrVisaStatusManagement;
