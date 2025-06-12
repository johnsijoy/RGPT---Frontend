import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, Chip, Stack, Divider, 
  List, ListItem, ListItemText, IconButton 
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import useApi from '../../hooks/useApi';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await api.get(`/activities/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id, api]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!activity) return <Typography>Activity not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/activities')}
        >
          Back to Activities
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Edit />}
          onClick={() => navigate(`/activities/edit/${id}`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">{activity.name}</Typography>
          <Chip 
            label={activity.status} 
            color={
              activity.status === 'Completed' ? 'success' : 
              activity.status === 'Pending' ? 'warning' : 'default'
            } 
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
          <List>
            <ListItem>
              <ListItemText 
                primary="Date" 
                secondary={new Date(activity.date).toLocaleDateString()} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Type" 
                secondary={activity.type || 'N/A'} 
              />
            </ListItem>
          </List>

          <List>
            <ListItem>
              <ListItemText 
                primary="Duration" 
                secondary={activity.duration ? `${activity.duration} minutes` : 'N/A'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Priority" 
                secondary={activity.priority || 'N/A'} 
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <Typography variant="body1">
            {activity.description || 'No description provided'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ActivityDetails;