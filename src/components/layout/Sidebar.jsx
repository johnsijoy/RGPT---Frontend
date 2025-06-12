import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, Drawer, Toolbar } from '@mui/material';
import { menuItems } from '../../constants/menuItems';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  const handleClick = (menu) => {
    setOpenMenus({ ...openMenus, [menu]: !openMenus[menu] });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1E3A4C',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <List>
  {menuItems.map((item) => (
    <React.Fragment key={item.title}>
      <ListItem
        button
        onClick={() => item.subItems && handleClick(item.title)}
        selected={location.pathname === item.path}
        component={item.path ? Link : 'div'}
        to={item.path}
      >
        <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: '#B69F72' } })}</ListItemIcon>
        <ListItemText primary={item.title} />
        {item.subItems && (openMenus[item.title] ? <ExpandLess sx={{ color: '#B69F72' }} /> : <ExpandMore sx={{ color: '#B69F72' }} />)}
      </ListItem>

      {item.subItems && (
        <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.subItems.map((subItem) => (
              <ListItem
              key={subItem.title}
              button
              component={Link}
              to={subItem.path}
              selected={location.pathname === subItem.path}
              sx={{
                pl: 4,
                color: '#B69F72',
                '& .MuiListItemIcon-root': {
                  color: '#B69F72',
                },
                '& .MuiTypography-root': {
                  color: '#B69F72',
                },
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                },
                '&:hover': {
                  backgroundColor: 'rgba(182, 159, 114, 0.1)',
                },
              }}
            >
              <ListItemIcon>{React.cloneElement(subItem.icon, { sx: { color: '#B69F72' } })}</ListItemIcon>
              <ListItemText primary={subItem.title} />
            </ListItem>
            
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  ))}
</List>


    </Drawer>
  );
};

export default Sidebar;
