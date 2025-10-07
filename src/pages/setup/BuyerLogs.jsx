import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  TableSortLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import * as XLSX from "xlsx";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Pagination from "../../components/common/Pagination";
import buyerLogs from "../../mock/buyerLogs";
import CloseIcon from "@mui/icons-material/Close";

const smallerInputSx = {
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    minHeight: "28px",
    paddingTop: "4px",
    paddingBottom: "4px",
    "& .MuiOutlinedInput-input": { padding: "4px 8px" },
    "& .MuiSelect-select": {
      paddingTop: "4px !important",
      paddingBottom: "4px !important",
      minHeight: "auto !important",
      lineHeight: "1.2 !important",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.75rem",
    top: -8,
    left: "0px",
    "&.MuiInputLabel-shrink": {
      top: 0,
      transform: "translate(14px, -7px) scale(0.75) !important",
      transformOrigin: "top left",
    },
  },
  "& .MuiSelect-icon": {
    fontSize: "1.2rem",
    top: "calc(50% - 0.6em)",
    right: "8px",
  },
};

const BuyerLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [checkedRows, setCheckedRows] = useState([]);
  const [data] = useState(buyerLogs);
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const rowsPerPage = 10;

  // dialog states
  const [open, setOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [formData, setFormData] = useState({
    buyerName: "",
    address: "",
    phone: "",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleOpenDialog = (buyer) => {
    setSelectedBuyer(buyer);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedBuyer(null);
    setFormData({ buyerName: "", address: "", phone: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitBooking = () => {
    alert(
      `Booking submitted:\nName: ${formData.buyerName}\nAddress: ${formData.address}\nPhone: ${formData.phone}\nProperty: ${selectedBuyer?.location}`
    );
    handleDialogClose();
  };

  // unique locations for dropdown
  const locations = [...new Set(data.map((row) => row.location))];

  // filter by search & location
  const filtered = data.filter((row) => {
    const matchesSearch =
      row.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.area.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.amount.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter
      ? row.location === locationFilter
      : true;

    return matchesSearch && matchesLocation;
  });

  // sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toLowerCase?.() || '';
    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
  
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ p: 3, width: "100%", backgroundColor: "#fff", borderRadius: 2 }}>
      <Breadcrumbs excludePaths={["setup"]} />

      {/* Heading + Search + Export */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Buyer Logs
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box /> {/* Left empty */}

          {/* Right side controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Search */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 160, ...smallerInputSx }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Location dropdown */}
            <FormControl size="xsmall" sx={{ minWidth: 160, ...smallerInputSx }}>
              <InputLabel>Location</InputLabel>
              <Select
                label="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Export */}
            <IconButton
              size="small"
              sx={{ color: "green" }}
              title="Export to Excel"
              onClick={() => {
                const headers = [
                  [
                    "S.No",
                    "Location",
                    "Latitude",
                    "Longitude",
                    "Area Sq Feet",
                    "Amount",
                  ],
                ];
                const rows = data.map((row) => [
                    row.sNo,
                  row.location,
                  row.latitude,
                  row.longitude,
                  row.area,
                  row.amount,
                ]);
                const worksheet = XLSX.utils.aoa_to_sheet([
                  ...headers,
                  ...rows,
                ]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "BuyerLogs");
                XLSX.writeFile(workbook, "buyer_logs.xlsx");
              }}
            >
              <DescriptionIcon fontSize="medium" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#122E3E" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  sx={{ color: "#fff" }}
                  checked={
                    paginated.length > 0 &&
                    paginated.every((row) =>
                      checkedRows.includes(row.sNo)
                    )
                  }
                  indeterminate={
                    checkedRows.length > 0 &&
                    checkedRows.length < paginated.length
                  }
                  onChange={(e) => {
                    const pageIds = paginated.map((row) => row.sNo);
                    if (e.target.checked) {
                      setCheckedRows((prev) => [
                        ...new Set([...prev, ...pageIds]),
                      ]);
                    } else {
                      setCheckedRows((prev) =>
                        prev.filter((id) => !pageIds.includes(id))
                      );
                    }
                  }}
                />
              </TableCell>
              {[
                "sNo",
                "location", 
                "latitude",
                "longitude",
                "area",
                "amount",
                "actions",
              ].map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    color: "#fff",
                    fontSize: 13,
                    "& .MuiTableSortLabel-root": { color: "#fff" },
                  }}
                >
               <TableSortLabel
  active={sortConfig.key === key}
  direction={
    sortConfig.key === key ? sortConfig.direction : "asc"
  }
  onClick={() => handleSort(key)}
  sx={{
    color: "white !important", // keep text white always
    "&:hover": {
      color: "white !important", // prevent black hover
    },
    "& .MuiTableSortLabel-icon": {
      color: "white !important", // keep arrow white
    },
  }}
>
  {{
    sNo: "S.No",
    location: "Location",
    latitude: "Latitude",
    longitude: "Longitude",
    area: "Area Sq Feet",
    amount: "Amount",
    actions: "Action", // added sorting for action too
  }[key]}
</TableSortLabel>

                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((row) => {
                const isChecked = checkedRows.includes(row.sNo);
                return (
                  <TableRow key={row.sNo}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={() =>
                          setCheckedRows((prev) =>
                            isChecked
                              ? prev.filter((id) => id !== row.sNo)
                              : [...prev, row.sNo]
                          )
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.sNo}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.location}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.latitude}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.longitude}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.area}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {row.bookingAvailable ? (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            fontSize: "0.7rem",
                            bgcolor: "#122E3E",
                            color: "#fff",
                            textTransform: "none",
                          }}
                          onClick={() => handleOpenDialog(row)}
                        >
                          Book Now
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          disabled
                          sx={{
                            fontSize: "0.7rem",
                            bgcolor: "#122E3E",
                            color: "#fff",
                            textTransform: "none",
                          }}
                        >
                          Booked
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 2 }}>
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(p) => setPage(p - 1)}
        />
      </Box>

      {/* Booking Dialog */}
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <span>Booking Details</span>
            <IconButton onClick={handleDialogClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Buyer Name"
            margin="dense"
            name="buyerName"
            value={formData.buyerName}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              fontSize: "0.75rem",
              "& .MuiInputBase-input": { fontSize: "0.75rem" },
              "& .MuiInputLabel-root": { fontSize: "0.75rem" },
            }}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              fontSize: "0.75rem",
              "& .MuiInputBase-input": { fontSize: "0.75rem" },
              "& .MuiInputLabel-root": { fontSize: "0.75rem" },
            }}
          />
          <TextField
            label="Mobile No"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              fontSize: "0.75rem",
              "& .MuiInputBase-input": { fontSize: "0.75rem" },
              "& .MuiInputLabel-root": { fontSize: "0.75rem" },
            }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Property:</strong>{" "}
            {selectedBuyer?.location || "N/A"} | {selectedBuyer?.area || "N/A"}{" "}
            sq.ft | ₹
            {selectedBuyer?.amount
              ? selectedBuyer.amount.toLocaleString()
              : "N/A"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmitBooking}
            sx={{
              bgcolor: "#122E3E",
              color: "#fff",
              fontSize: "0.75rem",
              padding: "4px 12px",
              textTransform: "none",
              "&:hover": { bgcolor: "#0e1e2a" },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BuyerLogs;
