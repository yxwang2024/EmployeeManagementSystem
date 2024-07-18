import React, { useState, useEffect } from "react";
import axios from "axios";

import {calculateRemainingDays,getDateString} from "../services/dateServices";
import { VisaStatusListItemType } from "../utils/type";

import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";


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
        step
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


interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


interface Column {
  id:
    | "name"
    | "title"
    | "startDate"
    | "endDate"
    | "remainingDays"
    | "nextStep"
    | "button";
  label: string;
  minWidth?: number;
  align?: "center" | "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "name", label: "Name", minWidth: 200 },
  { id: "title", label: "Title", minWidth: 100, align: "center" },
  {
    id: "startDate",
    label: "Start\u00a0Date",
    minWidth: 170,
    align: "center",
  },
  {
    id: "endDate",
    label: "End\u00a0Date",
    minWidth: 170,
    align: "center",
  },
  {
    id: "remainingDays",
    label: "Remaining\u00a0Days",
    minWidth: 100,
    align: "center",
  },
  {
    id: "nextStep",
    label: "Next\u00a0Step",
    minWidth: 300,
    align: "center",
  },
  {
    id: "button",
    label: "",
    minWidth: 170,
    align: "right",
  },
];


const HrVisaStatusTable: React.FC = ({option,search}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [visaStatuses, setVisaStatuses] = useState<VisaStatusListItemType[]>([]);
  console.log("option",option);
  useEffect(() => {
    if(option == "InProgress"){
      getAllVisaStatus().then((statuses) => {
        console.log("statuses", statuses);
        const statusList:VisaStatusListItemType[] = [];
        statuses.map((status)=>{
          if(status.step!="I20"&&status.status!="Approved"){
            const name:string = status.employee.profile.name.firstName+' '+status.employee.profile.name.middleName+' '+status.employee.profile.name.lastName;
            statusList.push({legalName:name,title:status.workAuthorization.title,startDate:status.workAuthorization.startDate,endDate:status.workAuthorization.endDate,status:status.status,step:status.step});
          }
        })
        setVisaStatuses(statusList);
        console.log("visaStatuses", statusList);
      });
    }
    else if(option == "All"){
      getAllVisaStatus().then((statuses) => {
        console.log("statuses", statuses);
        const statusList:VisaStatusListItemType[] = [];
        statuses.map((status)=>{
          let filter = {};
          if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
              $or: [
                { name: regex }
              ]
            }
          }
          const name:string = status.employee.profile.name.firstName+' '+status.employee.profile.name.middleName+' '+status.employee.profile.name.lastName;
          statusList.push({legalName:name,title:status.workAuthorization.title,startDate:status.workAuthorization.startDate,endDate:status.workAuthorization.endDate,status:status.status,step:status.step});
        })
        setVisaStatuses(statusList);
        console.log("visaStatuses", statusList);
      });
    }
    
  }, [option]);


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - visaStatuses.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table
          stickyHeader
          sx={{ minWidth: 500, maxWidth:800}}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? visaStatuses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : visaStatuses
            ).map((statusListItem) => (
              <TableRow hover key={statusListItem.legalName}>
                <TableCell style={{ width: 200 }} component="th" scope="row">
                  {statusListItem.legalName }
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {statusListItem.title}
                </TableCell>
                <TableCell style={{ width: 170 }} align="center">
                  {getDateString(statusListItem.startDate)}
                </TableCell>
                <TableCell style={{ width: 170 }} align="center">
                  {getDateString(statusListItem.endDate)}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {calculateRemainingDays(statusListItem.endDate)+' days'}
                </TableCell>
                <TableCell style={{ width: 300 }} align="center">
                  {statusListItem.step+'-'+statusListItem.status}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" variant="contained">
                    View All
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            
          </TableFooter>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={visaStatuses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          slotProps={{
            select: {
              inputProps: {
                "aria-label": "rows per page",
              },
              native: true,
            },
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableContainer>
    </Paper>
  );
}

export default HrVisaStatusTable;
