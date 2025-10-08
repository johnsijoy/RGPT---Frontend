import React, { useEffect, useRef, useState, useMemo } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";
import axios from "axios";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TablePagination,
  TableSortLabel,
  Toolbar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const popupRef = useRef(null);
  const [popupContent, setPopupContent] = useState("");
  const [open, setOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    tenant_id: null,
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    boundary_coords: null,
    rera_number: "",
    project_type: "Residential",
    launch_date: null,
    possession_date: null,
    status: "Available",
    total_area: "",
    total_units: 0,
    base_price: "",
    description: "",
    amenities: null,
    tax_details: null,
    created_by: "admin",
  });

  // 🟢 Style per status
  const getFeatureStyle = (status) => {
    let color = "blue";
    if (status === "Sold") color = "red";
    else if (status === "Under Contract") color = "orange";
    else if (status === "Available") color = "green";

    return new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: "#fff", width: 2 }),
      }),
    });
  };

  // 🟢 Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const mapObj = new Map({
      target: "map",
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: vectorSourceRef.current }),
      ],
      view: new View({
        center: fromLonLat([78.9629, 20.5937]), // Center on India
        zoom: 5,
      }),
    });

    mapRef.current = mapObj;

    // Popup overlay
    const popup = document.createElement("div");
    popup.className = "ol-popup bg-white p-2 rounded shadow text-sm";
    popup.style.position = "absolute";
    popup.style.background = "#fff";
    popup.style.padding = "5px 8px";
    popup.style.border = "1px solid #333";
    popup.style.borderRadius = "6px";

    const overlay = new Overlay({
      element: popup,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });
    mapObj.addOverlay(overlay);

    // 🟢 Hover event — show popup
    mapObj.on("pointermove", (evt) => {
      const feature = mapObj.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const props = feature.getProperties();
        popup.innerHTML = `<b>${props.name}</b><br>Status: ${props.status}<br>₹${props.base_price}`;
        overlay.setPosition(evt.coordinate);
        popup.style.display = "block";
      } else {
        popup.style.display = "none";
      }
    });

    // 🟢 Click event — navigate based on status
    mapObj.on("singleclick", (evt) => {
      const feature = mapObj.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const props = feature.getProperties();

        if (props.status === "Available" || props.status === "Under Contract") {
          navigate(`/payment/${props.id}`);
        } else {
          alert("❌ This property is not available for booking.");
        }
      }
    });
  }, [navigate]);

  // 🟢 Load property data
  const loadData = async () => {
    try {
      const res = await axios.get("https://rgpt-7.onrender.com/api/projects/");
      const data = res.data.results || res.data || [];

      setProperties(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          location_name: item.location || "",
          latitude: item.latitude,
          longitude: item.longitude,
          area_sq_ft: item.total_area,
          price: item.base_price,
          status: item.status,
        }))
      );

      const geoFeatures = data.map((item) => {
        const feature = new GeoJSON().readFeature(
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [item.longitude, item.latitude],
            },
            properties: item,
          },
          { featureProjection: "EPSG:3857" }
        );
        feature.setStyle(getFeatureStyle(item.status));
        return feature;
      });

      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeatures(geoFeatures);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🟢 Sorting
  const handleSort = (key) => {
    const isAsc = orderBy === key && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(key);

    const sorted = [...properties].sort((a, b) => {
      if (a[key] < b[key]) return newOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });
    setProperties(sorted);
  };

  // 🟢 Filters + Pagination
  const filteredData = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchQuery, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // 🟢 Create Project
  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("❌ No access token found. Please login first.");
        return;
      }

      await axios.post("https://rgpt-7.onrender.com/api/projects/", newProject, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("✅ Project created successfully!");
      setOpen(false);
      loadData();
    } catch (err) {
      console.error("Error creating project:", err);
      alert("❌ Failed to create project.");
    }
  };

  // 🟢 Excel Download
  const handleDownload = () => {
    const headers = [["ID", "Project Name", "Location", "Latitude", "Longitude", "Area Sq.Ft", "Price", "Status"]];
    const rows = properties.map((p) => [
      p.id,
      p.name,
      p.location_name,
      p.latitude,
      p.longitude,
      p.area_sq_ft,
      p.price,
      p.status,
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");
    XLSX.writeFile(workbook, "properties.xlsx");
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2 }}>
      {/* Breadcrumbs & Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Breadcrumbs excludePaths={["setup"]} />
        <Box>
          <IconButton size="small" sx={{ color: "green", mr: 1 }} title="Export to Excel" onClick={handleDownload}>
            <DescriptionIcon fontSize="medium" />
          </IconButton>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: "#122E3E", color: "#fff", fontSize: "0.75rem" }}
            onClick={() => setOpen(true)}
          >
            + Create
          </Button>
        </Box>
      </Box>

      {/* Table + Map */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Table Section */}
        <Box sx={{ flex: 1 }}>
          <Toolbar sx={{ pl: 0, pr: 0, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 150 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ width: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Sold">Sold</MenuItem>
                  <MenuItem value="Under Contract">Under Contract</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Toolbar>

          <Table size="small">
            <TableHead sx={{ background: "#122E3E" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }} />
                {["ID", "Project Name", "Location", "Area Sq.Ft", "Price", "Status"].map((head) => (
                  <TableCell key={head} sx={{ color: "#fff" }}>
                    <TableSortLabel
                      active={orderBy === head.toLowerCase().replace(/\s+/g, "")}
                      direction={order}
                      onClick={() => handleSort(head.toLowerCase().replace(/\s+/g, ""))}
                      sx={{
                        color: "#fff !important",
                        "& .MuiTableSortLabel-icon": { color: "#fff !important" },
                      }}
                    >
                      {head}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((prop) => (
                <TableRow key={prop.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(prop.id)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedRows([...selectedRows, prop.id]);
                        else setSelectedRows(selectedRows.filter((id) => id !== prop.id));
                      }}
                    />
                  </TableCell>
                  <TableCell>{prop.id}</TableCell>
                  <TableCell>{prop.name}</TableCell>
                  <TableCell>{prop.location_name}</TableCell>
                  <TableCell>{prop.area_sq_ft}</TableCell>
                  <TableCell>{prop.price}</TableCell>
                  <TableCell>{prop.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Box>

        {/* Map Section */}
        <Box
          sx={{
            flex: 1,
            height: "600px",
            borderRadius: 2,
            border: "1px solid #ccc",
            position: "relative",
          }}
        >
          <div id="map" style={{ width: "100%", height: "100%" }} />
        </Box>
      </Box>

      {/* Create Project Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: "#122E3E", color: "#fff", position: "relative", pr: 5 }}>
          Create New Project
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#fff",
              "&:hover": { color: "#ffcccc" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <TextField
              label="Location"
              fullWidth
              value={newProject.location}
              onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Latitude"
                fullWidth
                value={newProject.latitude}
                onChange={(e) => setNewProject({ ...newProject, latitude: e.target.value })}
              />
              <TextField
                label="Longitude"
                fullWidth
                value={newProject.longitude}
                onChange={(e) => setNewProject({ ...newProject, longitude: e.target.value })}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Total Area (sq.ft)"
                fullWidth
                value={newProject.total_area}
                onChange={(e) => setNewProject({ ...newProject, total_area: e.target.value })}
              />
              <TextField
                label="Base Price"
                fullWidth
                value={newProject.base_price}
                onChange={(e) => setNewProject({ ...newProject, base_price: e.target.value })}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Total Units"
                fullWidth
                value={newProject.total_units}
                onChange={(e) => setNewProject({ ...newProject, total_units: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newProject.status}
                  label="Status"
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                >
                  <MenuItem value="Sold">Sold</MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Under Contract">Under Contract</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateProject} variant="contained" sx={{ bgcolor: "#122E3E" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyDetails;
