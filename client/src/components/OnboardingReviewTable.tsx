import React, { useState, useEffect, useCallback } from "react";

import {
  getLegalName,
} from "../services/dateServices";
import {
  OnboardingListItemType,
  OnboardingConnectionResponseType,
  OnboardingConnectionType,
} from "../utils/type";
import { useAppSelector} from "../store/hooks";
import { useGlobal } from "../store/hooks";
import { delayFunctionCall } from "../utils/utilities";
import { useNavigate } from "react-router-dom";
import { request } from "../utils/fetch";

import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { useSearchParams } from "react-router-dom";
import { GET_ONBOARDING_CONNECTION } from "../services/queries";

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
    <Box sx={{ flexShrink: 0, ml: { xs: 1, md: 2.5 } }}>
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
  id: "legalName" | "email" | "status" | "button";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "center" | "right";
  display?: { xs: string; md: string };
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: "legalName",
    label: "Name",
    minWidth: 80,
    maxWidth: 100,
  },
  {
    id: "email",
    label: "Email",
    minWidth: 100,
    align: "center",
    maxWidth: 150,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    align: "center",
    display: { xs: "none", md: "table-cell" },
    maxWidth: 100,
  },
  {
    id: "button",
    label: "",
    minWidth: 60,
    align: "right",
    maxWidth: 80,
  },
];

const OnboardingReviewTable: React.FC<{ option: string }> = ({ option }) => {
  const navigate = useNavigate();
  const { showLoading, showMessage } = useGlobal();
  const search = useAppSelector((state) => state.search.value);
  const searchTriggered = useAppSelector((state) => state.search.trigger);

  // const [page, setPage] = React.useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "0");
  const setPage = (page: number) => {
    setSearchParams({ tab: "2", page: page.toString() });
  };
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [query, setQuery] = useState({
    first: rowsPerPage? rowsPerPage: 5,
    last: 0,
    before: "",
    after: "",
  });

  const [pageInfo, setPageInfo] = useState({
    totalCount: 0,
    startCursor: "",
    endCursor: "",
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [Onboardings, setOnboardings] = useState<OnboardingListItemType[]>([]);

  const getOnboardingConnection = useCallback(async () => {
    try {
      const response: OnboardingConnectionResponseType = await request(
        GET_ONBOARDING_CONNECTION,
        {
          first: query.first,
          after: query.after,
          last: query.last,
          before: query.before,
          query: search,
          status: option,
        }
      );
      const OnboardingConnection: OnboardingConnectionType =
        response.data.getOnboardingApplicationConnection;
      const edges = OnboardingConnection.edges;
      setPageInfo({
        totalCount: OnboardingConnection.totalCount,
        startCursor: OnboardingConnection.pageInfo.startCursor,
        endCursor: OnboardingConnection.pageInfo.endCursor,
        hasNextPage: OnboardingConnection.pageInfo.hasNextPage,
        hasPreviousPage: OnboardingConnection.pageInfo.hasPreviousPage,
      });
      const statusList: OnboardingListItemType[] = [];
      edges.map((edge) => {
        const name: string = getLegalName(
          edge.node.name.firstName,
          edge.node.name.middleName,
          edge.node.name.lastName
        );
        statusList.push({
          id: edge.node.id,
          legalName: name,
          status: edge.node.status,
          email: edge.node.email,
        });
      });
      console.log("edges", edges);
      console.log("statusList", statusList);
      setOnboardings(statusList);
    } catch (e) {
      console.log(e);
      showMessage(String(e));
    }
  }, [query, option, searchTriggered]);

  useEffect(() => {
    setPage(0);
    setQuery({
      first: rowsPerPage,
      last: 0,
      before: "",
      after: "",
    });
  }, [searchTriggered, option]);

  useEffect(() => {
    showLoading(true);
    getOnboardingConnection()
      .then(() => {
        delayFunctionCall(showLoading, 300, false);
      })
      .catch((error) => {
        console.error(error);
        showMessage(`failed to fetch visa status`, "failed", 2000);
        showLoading(false);
        // navigate('/login');
      });
  }, [getOnboardingConnection]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pageInfo.totalCount) : 0;

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    if (newPage === 0) {
      setPage(0);
      setQuery({
        first: rowsPerPage,
        last: 0,
        before: "",
        after: "",
      });
    } else if (newPage === page + 1) {
      setQuery({
        first: rowsPerPage,
        last: 0,
        before: "",
        after: pageInfo.endCursor,
      });
    } else if (newPage === page - 1) {
      setQuery({
        first: 0,
        last: rowsPerPage,
        before: pageInfo.startCursor,
        after: "",
      });
    } else if (
      newPage === Math.max(0, Math.ceil(pageInfo.totalCount / rowsPerPage) - 1)
    ) {
      setQuery({
        first: 0,
        last: rowsPerPage,
        before: "",
        after: "",
      });
    }

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setQuery({
      first: parseInt(event.target.value, 10),
      last: 0,
      before: "",
      after: "",
    });
  };

  const toDetailedView = (id: string) => {
    if (id) {
      // window.open(`/hiring-management/detailed/${id}`, "_blank");
      navigate(`/hiring-management/detailed/${id}`);
    }
  };
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table
          stickyHeader
          // sx={{ minWidth: 500 }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow key="header">
              {columns.map((column) => (
                <TableCell
                  key={column.id + "header"}
                  align={column.align}
                  sx={[{ maxWidth: column.maxWidth }, { display: column.display }]}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Onboardings.map((statusListItem) => (
              <React.Fragment key={statusListItem.id + "fragment"}>
                <TableRow hover key={statusListItem.id + "row"}>
                  {columns.map((column) => {
                    if (column.id === "button") {
                      return (
                        <TableCell
                          key={statusListItem.id + column.id}
                          align={column.align}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            style={{ width: "100%" }}
                            sx={{ display: { xs: "none", md: "block" } }}
                            key={statusListItem.id}
                            onClick={() => toDetailedView(statusListItem.id)}
                          >
                            Review
                          </Button>
                          <IconButton
                              onClick={() => toDetailedView(statusListItem.id)}
                              sx={{ display: { xs: "content", md: "none" }, alignItems: "center", justifyContent: "center" }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          key={statusListItem.id + column.id}
                          align={column.align}
                          sx={
                            column.display
                              ? { display: column.display, maxWidth: column.maxWidth }
                              : { maxWidth: column.maxWidth }
                          }
                        >
                          <Typography className="truncate" noWrap>
                            {statusListItem[column.id]}
                          </Typography>
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              </React.Fragment>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }} key="emptyRows">
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow key="footer">
            <TablePagination
          rowsPerPageOptions={[1, 2, 5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={pageInfo.totalCount}
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
          labelRowsPerPage="Rows"
          labelDisplayedRows={({ from, to, count }) =>
            // only show the page number on mobile
            window.innerWidth > 600
              ? `${from}-${to} of ${count}`
              : `Page ${page + 1}`
          }
          sx={{
            ".MuiTablePagination-selectLabel": { marginRight: 0 },
            ".MuiTablePagination-input": {
              marginLeft: 0,
              marginRight: { xs: 1, md: 10 },
            },
          }}
        />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OnboardingReviewTable;
