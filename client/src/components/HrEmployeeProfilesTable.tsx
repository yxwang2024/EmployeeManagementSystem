import React, { useState, useEffect,useCallback } from "react";

import { useTheme } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
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
import { Link } from "@mui/material";

import { ProfileListItemType } from "../utils/type";
import { formatSSN, formatPhoneNumber } from "../services/dateServices";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";
import { GET_VISA_STATUS_CONNECTION } from "../services/queries";
import { request } from "../utils/fetch";

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
      console.log("Not implemented.");
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
      |  "SSN"
      | "title"
      | "phone"
      | "email";
    label: string;
    minWidth?: number;
    align?: "center" | "right";
    format?: (value: number) => string;
  }

  const columns: Column[] = [
    { id: "name", label: "Name", minWidth: 150, align: "center" },
    { id: "SSN", label: "SSN", minWidth: 120, align: "center" },
    { id: "title", label: "Work\u00a0Authorization\u00a0Title", minWidth: 100, align: "center" },
    { id: "phone", label: "Phone", minWidth: 120, align: "center" },
    { id: "email", label: "Email", minWidth: 120, align: "center" },
  ];

const HrEmployeeProfilesTable: React.FC = () => {
    const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();

  const user = useAppSelector((state) => state.auth.user);
  const search = useAppSelector((state) => state.search.value);
  const searchTriggered = useAppSelector((state) => state.search.trigger);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(1);

  const profileList: ProfileListItemType[] = [
    {
        _id:"111",
        legalName: "A A",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"a@a.com"
    },
    {
        _id:"222",
        legalName: "B B",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"b@b.com"
    },
    {
        _id:"111",
        legalName: "A A",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"a@a.com"
    },
    {
        _id:"222",
        legalName: "B B",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"b@b.com"
    },
    {
        _id:"111",
        legalName: "A A",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"a@a.com"
    },
    {
        _id:"222",
        legalName: "B B",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"b@b.com"
    },
    {
        _id:"111",
        legalName: "A A",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"a@a.com"
    },
    {
        _id:"222",
        legalName: "B B",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"b@b.com"
    },
    {
        _id:"111",
        legalName: "A A",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"a@a.com"
    },
    {
        _id:"222",
        legalName: "B B",
        SSN:"123456789",
        title: "F1(CPT/OPT)",
        phone:"1234567890",
        email:"b@b.com"
    },
  ];

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - profileList.length) : 0;

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
  };

    return(
        <Paper>
      <TableContainer component={Paper}>
        <Table
          stickyHeader
          sx={{ minWidth: 500, maxWidth: 800 }}
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
            {profileList.map((profile) => (
              <React.Fragment>
                <TableRow hover key={profile.legalName}>
                  <TableCell style={{ width: 150 }} align="center"component="th" scope="row">
                    
                    <Link component="button" onClick={() => {navigate(`/employee-profiles/detailed/${profile._id}`);}}>
                        {profile.legalName}
                    </Link>
                  </TableCell>
                  <TableCell style={{ width: 170 }} align="center">
                    {formatSSN(profile.SSN)}
                  </TableCell>
                  <TableCell style={{ width: 170 }} align="center">
                    {profile.title}
                  </TableCell>
                  <TableCell style={{ width: 170 }} align="center">
                    {formatPhoneNumber(profile.phone)}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="center">
                    {profile.email}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
        <TablePagination
          rowsPerPageOptions={[1, 2, 5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={profileList.length}
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

export default HrEmployeeProfilesTable;