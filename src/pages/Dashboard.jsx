import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock Data
const mockLeadsPerDay = [
  { date: '2024-06-01', leads: 30 },
  { date: '2024-06-02', leads: 45 },
  { date: '2024-06-03', leads: 50 },
  { date: '2024-06-04', leads: 40 },
];

const mockLeadsPerCampaign = [
  { campaign: 'Campaign A', leads: 120 },
  { campaign: 'Campaign B', leads: 80 },
  { campaign: 'Campaign C', leads: 60 },
];

const mockLeadsByEmployeeStage = [
  { name: 'Alice', leads: 50 },
  { name: 'Bob', leads: 70 },
  { name: 'Charlie', leads: 40 },
];

const mockCostsPerCampaign = [
  { campaign: 'Campaign A', cost: 5000 },
  { campaign: 'Campaign B', cost: 3000 },
  { campaign: 'Campaign C', cost: 2000 },
];

const mockKeywords = [
  { keyword: 'Security', value: 400 },
  { keyword: 'Audit', value: 300 },
  { keyword: 'Compliance', value: 300 },
];

const mockPlacements = [
  { placement: 'Google', value: 500 },
  { placement: 'LinkedIn', value: 250 },
  { placement: 'Twitter', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Date Filter */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Dashboard Filter</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Charts Section - Vertical Layout */}
      <Grid container spacing={3}>
        {/* Area Chart: Number of Leads Per Day */}
        <Grid item size={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Number of Leads Per Day
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockLeadsPerDay}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart: Leads Per Campaign */}
        <Grid item size={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Leads Per Campaign
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockLeadsPerCampaign}>
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart: Leads By Employee */}
        <Grid item size={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Number of Leads By Employee By Stage
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockLeadsByEmployeeStage}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart: Costs Per Campaign */}
        <Grid item size={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Costs Per Campaign Wise
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockCostsPerCampaign}>
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Donut Pie Chart: Keywords */}
        <Grid item size={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Top Performing Keywords
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockKeywords}
                    dataKey="value"
                    nameKey="keyword"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    label
                  >
                    {mockKeywords.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Donut Pie Chart: Placements */}
        <Grid item size={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Top Performing Placements
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockPlacements}
                    dataKey="value"
                    nameKey="placement"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    label
                  >
                    {mockPlacements.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
