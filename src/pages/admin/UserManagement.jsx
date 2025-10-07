import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const groupedSections = [
  {
    title: 'User Management',
    items: ['Roles', 'List View Column', 'User Saved Query', 'Employees']
  },
  {
    title: 'General',
    items: [
      'List Of Values',
      'Entity ID Repository',
      'Reports',
      'Employee Logs',
      'Full Entity Audit Trail',
      'Task Schedule',
      'Setup Key Values',
      'Bulk Data Events',
      'Business Event Trail'
    ]
  },
  {
    title: 'SMS Management',
    items: ['Auto SMS Setup', 'SMS Outbox', 'SMS Setup', 'SMS Campaign']
  },
  {
    title: 'Email Management',
    items: ['Email Accounts', 'Email Campaign', 'Email Outbox', 'Auto Email Setup']
  },
  {
    title: 'Team Management',
    items: ['Team', 'Fudged Fields']
  },
  {
    title: 'Groovy Management',
    items: ['Groovy Config']
  },
  {
    title: 'Inbound Lead Management',
    items: ['Email To Lead', 'Portal Integration']
  },
  {
    title: 'Sales Master',
    items: ['Round Robin', 'Unit Configurations', 'Bungalow Configurations']
  },

  {
    title: 'Property Management',
    items: ['Property Details']
  }
];

const UserManagement = () => {
  const navigate = useNavigate();

const handleClick = (title) => {
  const routeMap = {
    'Reports': '/admin/usermanagement/reports',
    // Add more as needed
  };

  const defaultPath = `/admin/${title.toLowerCase().replace(/\s+/g, '-')}`;
  const path = routeMap[title] || defaultPath;
  navigate(path);
};


  return (
    <Layout>
      <Box sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
        <Box sx={{ fontSize: '0.75rem', mb: 2 }}>
          <Breadcrumbs current="User Management" />
        </Box>

        <Typography variant="h5" gutterBottom>
          Admin - User Management
        </Typography>

        <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
          {groupedSections.map((section, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderRadius: 2,
                  
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#122E3E',
                    color: '#fff',
                    padding: '8px 12px',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {section.title}
                  </Typography>
                </Box>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: 1 }}>
                    {section.items.map((item, i) => (
                      <Typography
                        key={i}
                        component={Link}
                        underline="hover"
                        sx={{
                          display: 'block',
                          fontSize: '0.85rem',
                          color: '#134ca7',
                          cursor: 'pointer',
                          mb: 0.5,
                          '&:hover': {
                            color: '#0f3c82'
                          }
                        }}
                        onClick={() => handleClick(item)}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default UserManagement;