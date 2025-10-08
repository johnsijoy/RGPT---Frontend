import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, CircularProgress, Button, Divider } from "@mui/material";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`https://rgpt-13.onrender.com/api/projects/${id}/`);
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!project) return <Typography>Project not found</Typography>;

  const handlePayment = () => {
    // Redirect to payment page or trigger payment flow
    window.location.href = `/payment/${project.id}`; 
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 800,
        margin: "auto",
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
        mt: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, color: "#122E3E", fontWeight: "bold" }}
      >
        {project.name}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography sx={{ mb: 1 }}><strong>Location:</strong> {project.location}</Typography>
        <Typography sx={{ mb: 1 }}><strong>Area:</strong> {project.total_area} sq.ft</Typography>
        <Typography sx={{ mb: 1 }}><strong>Price:</strong> ₹{project.base_price?.toLocaleString()}</Typography>
        <Typography sx={{ mb: 1 }}><strong>Status:</strong> {project.status}</Typography>
        <Typography sx={{ mb: 1 }}><strong>Description:</strong> {project.description || "N/A"}</Typography>
        <Typography sx={{ mb: 1 }}><strong>Latitude:</strong> {project.latitude}</Typography>
        <Typography sx={{ mb: 1 }}><strong>Longitude:</strong> {project.longitude}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Button
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#122E3E",
          color: "#fff",
          "&:hover": { bgcolor: "#0f2430" },
        }}
        onClick={handlePayment}
      >
        Payment Now
      </Button>
    </Box>
  );
};

export default ProjectDetail;
