import React, { useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import Filters from '../../components/common/Filters';
import { leadsData } from '../../mock/leads';

const LeadsList = () => {
  const [filters, setFilters] = useState([
    { name: 'name', label: 'Name', value: '' },
    { name: 'email', label: 'Email', value: '' }
  ]);

  const [page, setPage] = useState(1);

  const handleFilterChange = (name, value) => {
    setFilters((prev) =>
      prev.map((f) => (f.name === name ? { ...f, value } : f))
    );
  };

  const handleReset = () => {
    setFilters((prev) => prev.map((f) => ({ ...f, value: '' })));
  };

  const filteredLeads = leadsData.filter((lead) =>
    filters.every((f) =>
      lead[f.name]?.toLowerCase().includes(f.value.toLowerCase())
    )
  );

  return (
    <Box p={2}>
      <Breadcrumbs />
      <Typography variant="h6" gutterBottom>
        Leads List
      </Typography>

      <Filters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.slice((page - 1) * 5, page * 5).map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Pagination
        count={Math.ceil(filteredLeads.length / 5)}
        page={page}
        onChange={setPage}
      />
    </Box>
  );
};

export default LeadsList;
