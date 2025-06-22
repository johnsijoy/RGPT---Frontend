import React from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from '@mui/material';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Box sx={{ fontSize: '0.75rem', mb: 1 }}>
    <MUIBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2, fontSize: '0.75rem' }}>
      <Link underline="hover" color="inherit" href="/" >
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography fontSize="0.75rem" color="text.secondary">
            {decodeURIComponent(value.replace(/-/g, ' '))}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            href={to}
            key={to}
            sx={{ textTransform: 'capitalize' }}
          >
            {decodeURIComponent(value.replace(/-/g, ' '))}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;