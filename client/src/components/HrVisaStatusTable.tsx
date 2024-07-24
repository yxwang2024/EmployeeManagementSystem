import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from 'react-router-dom';

import {
  calculateRemainingDays,
  getDateString,
  getLegalName,
} from "../services/dateServices";
import { nextStep } from "../services/records";
import {
  VisaStatusListItemType,
  VisaStatusPopulatedType,
  AllVisaStatusesResponseType,
  VisaStatusConnectionResponseType,
  VisaStatusConnectionType,
} from "../utils/type";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";
import { GET_VISA_STATUS_CONNECTION } from "../services/queries";
import { request } from "../utils/fetch";

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
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

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
  { id: "name", label: "Name", minWidth: 200, align: "center" },
  { id: "title", label: "Title", minWidth: 100, align: "center" },
  {
    id: "startDate",
    label: "Start\u00a0Date",
    minWidth: 120,
    align: "center",
  },
  {
    id: "endDate",
    label: "End\u00a0Date",
    minWidth: 120,
    align: "center",
  },
  {
    id: "remainingDays",
    label: "Remaining\u00a0Days",
    minWidth: 150,
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

const HrVisaStatusTable: React.FC = () => {
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();

  const user = useAppSelector((state) => state.auth.user);
  const search = useAppSelector((state) => state.search.value);
  const searchTriggered = useAppSelector((state) => state.search.trigger);
  const option = useAppSelector((state) => state.option.value);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);

  const [first, setFirst] = React.useState(2);
  const [last, setLast] = React.useState(0);
  const [before, setBefore] = React.useState("");
  const [after, setAfter] = React.useState("");
  const [totalCount, setTotalCount] = React.useState(0);
  const [startCursor, setStartCursor] = React.useState("");
  const [endCursor, setEndCursor] = React.useState("");
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [hasPreviousPage, setHasPreviousPage] = React.useState(false);

  const [visaStatuses, setVisaStatuses] = useState<VisaStatusListItemType[]>(
    []
  );

  const getVisaStatusConnection = useCallback(async () => {
    try {
      const response: VisaStatusConnectionResponseType = await request(
        GET_VISA_STATUS_CONNECTION,
        {
          first: first,
          after: after,
          last: last,
          before: before,
          query: search,
          status: option === "InProgress" ? "In Progress" : "",
        }
      );
      const visaStatusConnection: VisaStatusConnectionType =
        response.data.getVisaStatusConnection;
      const edges = visaStatusConnection.edges;
      setTotalCount(visaStatusConnection.totalCount);
      setHasNextPage(visaStatusConnection.pageInfo.hasNextPage);
      setHasPreviousPage(visaStatusConnection.pageInfo.hasPreviousPage);
      setStartCursor(visaStatusConnection.pageInfo.startCursor);
      setEndCursor(visaStatusConnection.pageInfo.endCursor);
      const statusList: VisaStatusListItemType[] = [];
      if (option == "InProgress") {
        edges.map((edge) => {
          if (edge.node.step != "I20" || edge.node.status != "Approved") {
            const name: string = getLegalName(
              edge.node.employee.profile.name.firstName,
              edge.node.employee.profile.name.middleName,
              edge.node.employee.profile.name.lastName
            );
            statusList.push({
              _id: edge.node._id,
              legalName: name,
              title: edge.node.workAuthorization.title,
              startDate: edge.node.workAuthorization.startDate,
              endDate: edge.node.workAuthorization.endDate,
              status: edge.node.status,
              step: edge.node.step,
            });
          }
        });
      } else if (option == "All") {
        edges.map((edge) => {
          const name: string = getLegalName(
            edge.node.employee.profile.name.firstName,
            edge.node.employee.profile.name.middleName,
            edge.node.employee.profile.name.lastName
          );
          statusList.push({
            _id: edge.node._id,
            legalName: name,
            title: edge.node.workAuthorization.title,
            startDate: edge.node.workAuthorization.startDate,
            endDate: edge.node.workAuthorization.endDate,
            status: edge.node.status,
            step: edge.node.step,
          });
        });
      }
      setVisaStatuses(statusList);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  }, [option, user, before, after, last, first, searchTriggered, rowsPerPage]);


  useEffect(() => {
    setPage(0);
    setAfter("");
    setBefore("");
    setFirst(rowsPerPage);
    setLast(0);
  }, [searchTriggered, option]);

  
  useEffect(() => {
    showLoading(true);
    getVisaStatusConnection()
      .then(() => {
        delayFunctionCall(showLoading, 300, false);
      })
      .catch((error) => {
        console.error(error);
        showMessage(`failed to fetch visa status`, "failed", 2000);
        showLoading(false);
        // navigate('/login');
      });
  }, [getVisaStatusConnection]);

  // useEffect(() => {
  //   showLoading(true);
  //   getVisaStatuses()
  //     .then(() => {
  //       delayFunctionCall(showLoading, 300, false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       showMessage(`failed to fetch visa status`, "failed", 2000);
  //       showLoading(false);
  //       // navigate('/login');
  //     });
  // }, [getVisaStatuses]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalCount) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    if (newPage === 0) {
      setPage(0);
      setAfter("");
      setBefore("");
      setFirst(rowsPerPage);
      setLast(0);
    } else if (newPage === page + 1) {
      setAfter(endCursor);
      setBefore("");
      setFirst(rowsPerPage);
      setLast(0);
    } else if (newPage === page - 1) {
      setAfter("");
      setBefore(startCursor);
      setFirst(rowsPerPage);
      setLast(0);
    } else if (
      newPage === Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1)
    ) {
      setLast(rowsPerPage);
      setAfter("");
      setBefore("");
      setFirst(0);
    }

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setFirst(parseInt(event.target.value, 10));
    setLast(0);
    setPage(0);
    setAfter("");
    setBefore("");
  };

  const toDetailedView = (id: string) => {
    if (id) {
      navigate(`/visa-status-management/detailed/${id}`);
    }
  };



  return (
    <Paper>
      {totalCount == 0 && (
        <Typography variant="body1" color={"error.light"}>
          No search results.
        </Typography>
      )}
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
            {visaStatuses.map((statusListItem) => (
              <React.Fragment key={statusListItem._id + 'fragment'}>
                <TableRow hover key={statusListItem.legalName}>
                  <TableCell
                    style={{ width: 200 }}
                    component="th"
                    scope="row"
                    align="center"
                  >
                    {statusListItem.legalName}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="center">
                    {statusListItem.title}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="center">
                    {getDateString(statusListItem.startDate)}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="center">
                    {getDateString(statusListItem.endDate)}
                  </TableCell>
                  <TableCell style={{ width: 120 }} align="center">
                    {calculateRemainingDays(statusListItem.endDate) + " days"}
                  </TableCell>
                  <TableCell style={{ width: 300 }} align="center">
                    {nextStep[statusListItem?.step][statusListItem?.status]}
                  </TableCell>
                  <TableCell align="right">
                    {option == "InProgress" ? (
                      <Button
                        size="small"
                        variant="contained"
                        style={{ width: "150px" }}
                        onClick={() => toDetailedView(statusListItem._id)}
                      >
                        Action
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        style={{ width: "150px" }}
                        onClick={() => toDetailedView(statusListItem._id)}
                      >
                        Review
                      </Button>
                    )}
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
          count={totalCount}
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
};

export default HrVisaStatusTable;
