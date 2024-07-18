import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { jwtDecode } from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { EmployeeInstanceType, HRInstanceType } from '../utils/type';

const UserPages = ['Personal Information', 'Visa Status'];
const HRpages = ['Home', 'Employee Profiles', 'Visa Status Management', 'Hiring Management'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user); 
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const [isHR, setIsHR] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token); 
        setIsHR(decoded.role !== 'Employee'); 
      } catch (error) {
        console.error('Token decoding failed:', error);
        setIsHR(null);
      }
    } else {
      setIsHR(null); 
    }
  }, [token]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const settings = token ? ['Logout'] : ['Login'];

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <WbSunnyIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Workday Chuwa
          </Typography>

          {token && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {isHR !== null && (isHR ? HRpages : UserPages).map((page) => (
                  // <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <MenuItem key={page} onClick={() => { navigate(page.toLowerCase().replace(' ', '-')) }}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <WbSunnyIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            W Chuwa
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', mr: 4 }}>
            {/* {isHR !== null && (isHR ? HRpages : UserPages).map((page) => (
              <Button
                key={page}
                onClick={() => { navigate(page.toLowerCase().replace(' ', '-')) }}
                sx={{ fontSize: '18px', my: 2, color: 'white', display: 'block', textTransform: 'none' }}
              >
                {page}
              </Button>
            ))} */}
            {isHR !== null && (isHR ? HRpages.map((page) => (
              <Button
                key={page}
                onClick={() => { navigate(page.toLowerCase().replace(' ', '-')) }}
                sx={{ fontSize: '18px', my: 2, color: 'white', display: 'block', textTransform: 'none' }}
              >
                {page}
              </Button>
            )) : UserPages.map((page) => (
              <Button
                key={page}
                onClick={() => { navigate(page.toLowerCase().replace(' ', '-')) }}
                sx={{ fontSize: '18px', my: 2, color: 'white', textTransform: 'none', display:
                  `${(user?.instance as EmployeeInstanceType).onboardingApplication.status === 'Approved' ? 'block' : 'none'}`
                }}
              >
                {page}
              </Button>
            ))
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {token ? (
                  <Avatar alt={user?.username} src={'/static/images/avatar/2.jpg'} />
                  // <Avatar alt={user?.username} src={user?.profile.profilePicture || '/static/images/avatar/2.jpg'} />
                ) : (
                  <NoAccountsIcon style={{ fill: "white" }} fontSize="large" />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleLogin}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;