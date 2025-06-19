import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Toolbar,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { menuItems } from '../../constants/menuItems';

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  const handleClick = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
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
            <ListItemButton
              onClick={() => item.subItems && handleClick(item.title)}
              selected={location.pathname === item.path}
              component={item.path ? Link : 'div'}
              to={item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, { sx: { color: '#B69F72' } })}
              </ListItemIcon>
              <ListItemText primary={item.title} />
              {item.subItems &&
                (openMenus[item.title] ? (
                  <ExpandLess sx={{ color: '#B69F72' }} />
                ) : (
                  <ExpandMore sx={{ color: '#B69F72' }} />
                ))}
            </ListItemButton>

            {item.subItems && (
              <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.title}
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
                      <ListItemIcon>
                        {React.cloneElement(subItem.icon, { sx: { color: '#B69F72' } })}
                      </ListItemIcon>
                      <ListItemText primary={subItem.title} />
                    </ListItemButton>
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
