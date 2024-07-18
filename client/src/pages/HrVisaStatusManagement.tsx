import axios from "axios";
import React, { useState, useEffect } from "react";
import { Box, Paper,Button,Stack } from "@mui/material";
import HrVisaStatusTable from "../components/HrVisaStatusTable";
import SearchBar from "../components/SearchBar";
const getAllVisaStatus = async () => {
  //graphql query to get visa status
  const query = `
    query GetVisaStatuses {
      getVisaStatuses {
        _id
        employee {
          profile {
            name {
              firstName
              middleName
              lastName
            }
          }
        }
        workAuthorization {
          title
          startDate
          endDate
        }
        status
      }
    }
  `;
  try {
    const response = await axios.post("http://localhost:3000/graphql", {
      query,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.errors) {
      console.log("Response data errors:", response.data.errors);
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.getVisaStatuses;
  } catch (error) {
    console.error(error);
  }
};

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
