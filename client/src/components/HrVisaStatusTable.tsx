import * as React from "react";
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

function createData(
  name: string,
  title: string,
  startDate: string,
  endDate: string,
  remainingDays: string,
  nextStep: string
) {
  return { name, title, startDate, endDate, remainingDays, nextStep };
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
    minWidth: 170,
    align: "center",
  },
  {
    id: "button",
    label: "",
    minWidth: 170,
    align: "right",
  },
];

const rows = [
  createData("Cupcake", "OPT", "2024-01-01", "2025-01-01", "190", "HR Review"),
  createData("Donut", "OPT", "2024-01-01", "2025-01-01", "190", "HR Review"),
  createData("Eclair", "OPT", "2024-01-01", "2025-01-01", "190", "HR Review"),
  createData(
    "Frozen yoghurt",
    "OPT",
    "2024-01-01",
    "2025-01-01",
    "190",
    "HR Review"
  ),
  createData(
    "Gingerbread",
    "OPT",
    "2024-01-01",
    "2025-01-01",
    "190",
    "HR Review"
  ),
  createData(
    "Honeycomb",
    "OPT",
    "2024-01-01",
    "2025-01-01",
    "190",
    "HR Review"
  ),
  createData(
    "Ice cream sandwich",
    "OPT",
    "2024-01-01",
    "2025-01-01",
    "190",
    "HR Review"
  ),
  createData(
    "Jelly Bean",
    "OPT",
    "2024-01-01",
    "2025-01-01",
    "190",
    "HR Review"
  ),
  createData("KitKat", "OPT", "2024-01-01", "2025-01-01", "190", "HR Review"),
  createData("Lollipop", "OPT", "2024-01-01", "2025-01-01", "190", "HR Review"),
  createData(
    "Marshmallow",
    "OPT",
    "2024-01-01",
    "2025-01-01",
    "190",
    "HR Review"
  ),
  createData("Nougat", "OPT", "2024-01-01", "2025-01-01", "190", "HR Review"),
  createData("Oreo", "OPT", "2024-01-01", "2025-01-01", "190", "HR Review"),
].sort();

export default function HrVisaStatusTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
          sx={{ minWidth: 500 }}
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
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow hover key={row.name}>
                <TableCell style={{ width: 200 }} component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {row.title}
                </TableCell>
                <TableCell style={{ width: 170 }} align="center">
                  {row.startDate}
                </TableCell>
                <TableCell style={{ width: 170 }} align="center">
                  {row.endDate}
                </TableCell>
                <TableCell style={{ width: 100 }} align="center">
                  {row.remainingDays}
                </TableCell>
                <TableCell style={{ width: 170 }} align="center">
                  {row.nextStep}
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
          count={rows.length}
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
