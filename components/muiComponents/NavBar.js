import React from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { modelState } from '../../atoms/modelSearchAtom';
import HandymanIcon from '@mui/icons-material/Handyman';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import HistoryIcon from '@mui/icons-material/History';
import { signOut, useSession } from 'next-auth/react';
import Popup from './Popup';
import UsePart from '../UsePart';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: '100%',
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',

    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const ResponsiveAppBar = () => {
  const { data: session, status } = useSession();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    fetch('/api/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    auth.signOut();
    signOut();
  }

  const [modelSearchQuery, setModelSearchQuery] = useRecoilState(modelState);
  const [openUsePopup, setOpenUsePopup] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const blurHandler = () => {};

  const routePath = router.pathname;

  if (status === 'authenticated') {
    return (
      <>
        <AppBar sx={{ backgroundColor: '#272727' }} position="sticky">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Link href="/">
                <div className="SiteName">
                  <Button
                    disableRipple
                    onClick={() => {
                      router.push('/');
                    }}
                    sx={{
                      mr: 2,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'none',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.7rem',
                        fontWeight: 500,
                      }}
                      component="div"
                    >
                      Consignment
                    </Typography>
                  </Button>
                </div>
              </Link>

              <div className="NavBarMobileMenu">
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
                  disableAutoFocusItem
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
                  <MenuItem
                    onClick={() => {
                      setAnchorElNav(null);

                      router.push('/');
                    }}
                  >
                    <Typography textAlign="center">Home</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorElNav(null);

                      router.push('/logger');
                    }}
                  >
                    <Typography textAlign="center">Part History</Typography>
                  </MenuItem>
                </Menu>
              </div>

              <div className="NavBarMenuIcons">
                <Link href="/addpart">
                  <Tooltip title="Add Part">
                    <Button
                      sx={{
                        color: 'white',
                        display: 'block',
                        '&:hover': { backgroundColor: '#455A64' },
                      }}
                    >
                      <LibraryAddIcon
                        sx={{
                          color: 'white',
                          '&:hover': {
                            color: 'white',
                          },
                          fontSize: '1.8rem',
                        }}
                      />
                    </Button>
                  </Tooltip>
                </Link>

                <Link href="/logger">
                  <Tooltip title="Part history">
                    <Button
                      sx={{
                        color: 'white',
                        display: 'block',
                        '&:hover': { backgroundColor: '#455A64' },
                      }}
                    >
                      <HistoryIcon
                        sx={{
                          color: 'white',
                          '&:hover': {
                            color: 'white',
                          },
                          fontSize: '2rem',
                        }}
                      />
                    </Button>
                  </Tooltip>
                </Link>

                <Tooltip title="Utilize Part">
                  <Button
                    disableRipple
                    onClick={() => {
                      setOpenUsePopup(true);
                    }}
                    sx={{
                      color: 'white',
                      display: 'block',
                      '&:hover': { backgroundColor: '#455A64' },
                    }}
                  >
                    <HandymanIcon
                      sx={{
                        color: 'white',
                        '&:hover': {
                          color: 'white',
                        },
                        fontSize: '1.8rem',
                      }}
                    />
                  </Button>
                </Tooltip>
              </div>

              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>

                <StyledInputBase
                  placeholder="Search Model..."
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  onBlur={blurHandler}
                  onKeyPress={(e) => {
                    if (e.code === 'Enter') {
                      if (routePath == '/') {
                      } else {
                        router.push('/');
                      }
                    }
                  }}
                />
              </Search>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={session.user.name} src={session.user.image} />
                  </IconButton>
                </Tooltip>
                <Menu
                  disableAutoFocusItem
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
                  <MenuItem
                    onClick={() => {
                      fetch('/api/logout', {
                        method: 'post',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                      });

                      auth.signOut().then(
                        () => {
                          signOut();
                        },
                        function (error) {
                          console.log('error', error);
                        }
                      );
                    }}
                  >
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Popup
          title="UTILIZE PART"
          openPopup={openUsePopup}
          setOpenPopup={setOpenUsePopup}
        >
          <UsePart />
        </Popup>
      </>
    );
  }

  return <></>;
};
export default ResponsiveAppBar;
