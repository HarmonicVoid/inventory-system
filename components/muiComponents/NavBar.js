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

const pages = ['Part History'];

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
  backgroundColor: 'orange',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    backgroundColor: 'green',
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

  const blurHandler = () => {
    console.log('input blurred');
  };

  const routePath = router.pathname;

  if (status === 'authenticated') {
    return (
      <>
        <AppBar sx={{ backgroundColor: '#272727' }} position="sticky">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontSize: '1.7rem',
                  mr: 3,
                  display: { xs: 'none', md: 'flex' },
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (routePath == '/') {
                  } else {
                    router.push('/');
                  }
                }}
              >
                Consignment
              </Typography>

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
                      if (routePath == '/logger') {
                      } else {
                        router.push('/logger');
                      }
                    }}
                  >
                    <Typography textAlign="center">Part History</Typography>
                  </MenuItem>
                </Menu>
              </div>

              <div className="NavBarMenuIcons">
                <Tooltip title="Add Part">
                  <Button
                    sx={{
                      color: 'white',
                      display: 'block',
                      '&:hover': { backgroundColor: '#455A64' },
                    }}
                    onClick={() => {
                      if (routePath == '/addpart') {
                      } else {
                        router.push('/addpart');
                      }
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

                <Tooltip title="Part history">
                  <Button
                    sx={{
                      color: 'white',
                      display: 'block',
                      '&:hover': { backgroundColor: '#455A64' },
                    }}
                    onClick={() => {
                      if (routePath == '/logger') {
                      } else {
                        router.push('/logger');
                      }
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
                  <MenuItem onClick={signOut}>
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
};
export default ResponsiveAppBar;
