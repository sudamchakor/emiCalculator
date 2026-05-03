import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Collapse, // Added for collapsible groups
  Button,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  KeyboardArrowDown as ArrowDownIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as TaxIcon,
  Payments as PersonalLoanIcon,
  Menu as MenuIcon,
  FileDownload as ExportIcon,
  AccountCircle as ProfileIcon,
  Person as PersonIcon,
  EmojiEvents as GoalsIcon,
  Dashboard as WealthIcon,
  Settings as SettingsIcon,
  RestartAlt as ResetIcon,
  ExpandLess, // Icon for open
  ExpandMore, // Icon for closed
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCalculatedValues } from '../../features/emiCalculator/utils/emiCalculator';
import { resetEmiState } from '../../store/emiSlice';
import storage from 'redux-persist/lib/storage';

const calculators = [
  { path: '/calculator', label: 'Home Loan EMI', icon: <CalculateIcon /> },
  {
    path: '/credit-card-emi',
    label: 'Credit Card EMI',
    icon: <CreditCardIcon />,
  },
  { path: '/investment', label: 'Investment', icon: <TrendingUpIcon /> },
  {
    path: '/personal-loan',
    label: 'Personal Loan',
    icon: <PersonalLoanIcon />,
  },
  { path: '/tax-calculator', label: 'Tax Calculator', icon: <TaxIcon /> },
];

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // --- STATE FOR COLLAPSIBLE GROUPS ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCalculators, setOpenCalculators] = useState(true); // Default open
  const [openAccount, setOpenAccount] = useState(false);

  // Desktop Menu States
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const contrastColor = theme.palette.getContrastText(
    theme.palette.primary.main,
  );

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false); // Close drawer on click
    setAnchorEl(null);
    setProfileAnchorEl(null);
  };

  const handleResetData = async () => {
    if (window.confirm('This will clear all your data. Continue?')) {
      dispatch(resetEmiState());
      await storage.removeItem('persist:app_v1');
      localStorage.clear();
      window.location.reload();
    }
  };

  const currentCalc =
    calculators.find((c) => location.pathname.startsWith(c.path)) ||
    calculators[0];

  const menuStyle = {
    paper: {
      elevation: 0,
      sx: {
        mt: 1.5,
        minWidth: 220,
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(12px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      },
    },
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: contrastColor,
          zIndex: isMobile ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              {isMobile && (
                <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
                  <MenuIcon />
                </IconButton>
              )}
              <Box
                onClick={() => handleNavigation('/')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 1,
                }}
              >
                <CalculateIcon sx={{ fontSize: 32 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, display: { xs: 'none', sm: 'block' } }}
                >
                  SmartFund Manager
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
              sx={{ bgcolor: alpha(contrastColor, 0.1), color: 'inherit' }}
            >
              <ProfileIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* --- RESTRUCTURED DRAWER WITH COLLAPSIBLE GROUPS --- */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 300, backgroundColor: theme.palette.background.paper },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateIcon color="primary" sx={{ fontSize: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            SmartFund{' '}
            <span style={{ color: theme.palette.primary.main }}>Manager</span>
          </Typography>
        </Box>
        <Divider />

        <List sx={{ p: 1 }}>
          {/* GROUP 1: CALCULATORS */}
          <ListItemButton onClick={() => setOpenCalculators(!openCalculators)}>
            <ListItemIcon>
              <CalculateIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Calculators"
              primaryTypographyProps={{ fontWeight: 700 }}
            />
            {openCalculators ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openCalculators} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {calculators.map((calc) => (
                <ListItemButton
                  key={calc.path}
                  sx={{ pl: 4, borderRadius: 2 }}
                  onClick={() => handleNavigation(calc.path)}
                  selected={location.pathname.startsWith(calc.path)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{calc.icon}</ListItemIcon>
                  <ListItemText
                    primary={calc.label}
                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* GROUP 2: MY ACCOUNT (Profile) */}
          <ListItemButton onClick={() => setOpenAccount(!openAccount)}>
            <ListItemIcon>
              <ProfileIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="My Account"
              primaryTypographyProps={{ fontWeight: 700 }}
            />
            {openAccount ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openAccount} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4, borderRadius: 2 }}
                onClick={() => handleNavigation('/profile?tab=personal')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Personal Profile"
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, borderRadius: 2 }}
                onClick={() => handleNavigation('/profile?tab=goals')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <GoalsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Financial Goals"
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, borderRadius: 2 }}
                onClick={() => handleNavigation('/profile?tab=wealth')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <WealthIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Wealth Dashboard"
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* STATIC ITEMS */}
          <ListItemButton onClick={() => handleNavigation('/settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Global Settings" />
          </ListItemButton>

          <ListItemButton onClick={() => handleNavigation('/faq')}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & FAQ" />
          </ListItemButton>

          <Box sx={{ mt: 4, p: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<ResetIcon />}
              onClick={handleResetData}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Reset All Data
            </Button>
          </Box>
        </List>
      </Drawer>

      {/* Keep Desktop Menus for non-mobile use */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={() => setProfileAnchorEl(null)}
        SlotProps={menuStyle}
      >
        <MenuItem onClick={() => handleNavigation('/profile?tab=personal')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Personal Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/profile?tab=goals')}>
          <ListItemIcon>
            <GoalsIcon fontSize="small" />
          </ListItemIcon>
          Financial Goals
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/profile?tab=wealth')}>
          <ListItemIcon>
            <WealthIcon fontSize="small" />
          </ListItemIcon>
          Wealth Dashboard
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigation('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
