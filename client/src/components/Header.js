import * as React from 'react';
import { Button, ButtonGroup, AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Avatar } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import logoImg from '../images/logo.jpg';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useState, useEffect, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
// import LogoutIcon from '@mui/icons-material/Logout';
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

function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const { userInfo, setUserInfo, isLoading } = useContext(UserContext);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsLoggedOut(false);
    };
    // useEffect(() => {
    //     // const userData = localStorage.getItem('user');
    //     // const user = userData ? JSON.parse(userData) : null;
    //     // console.log("jnwkj",user.token)
    //     fetch('http://127.0.0.1:5000/profile', {
    //       credentials: 'include',
    //     //   headers: {
    //     //     'Authorization': `Bearer ${user.token}` // Place the Authorization header here
    //     //   }

    //     })
    //       .then(res => {
    //         res.json().then(userInfo => {
    //           console.log("User info:", userInfo);
    //           setUserInfo(userInfo);
    //         });
    //       })
    //       .catch(error => {
    //         console.error("Fetch error:", error);
    //       });
    //   }, []);

    function logout() {
        fetch('http://127.0.0.1:5000/logout', {
            credentials: "include",
            method: "POST"
        })
            .then(() => {
                // <Navigate to='/category' />
                setIsLoggedOut(true); 
                setUserInfo(null);
            })
        // localStorage.removeItem('user');


    }


    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const showPosts = (e) =>{
        handleMenuClose();
    }


    const username = userInfo?.username;
    const userid = userInfo?.id;
    console.log(userid)
    
    const searchStyle = {
        width: 600
    }
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    href='/user/savedposts'
                >
                    <BookmarksIcon />
                    Saved
                </IconButton>
                
            </MenuItem>
            
            <MenuItem onClick={()=>showPosts()}>
            <Link to={'/user/posts'} style={{ textDecoration: "none", color: "inherit", fontSize:'20px', fontWeight:'500' }}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <BookmarksIcon />
                        <p>My Posts</p>
                    </IconButton>
                    </Link>
                
            </MenuItem>
            
            <MenuItem onClick={handleMenuClose}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                Notifications
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}

        >


            {
                
                !username && (<> <Link to={'/login'} style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuItem >
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <Badge color="error">
                                <LoginIcon />
                            </Badge>
                        </IconButton>
                        <p>Login</p>
                    </MenuItem>
                </Link>
                    <Link to={'/signup'} style={{ textDecoration: "none", color: "inherit" }}>
                        <MenuItem>
                            <IconButton
                                size="large"
                                color="inherit"
                            >
                                <Badge color="error">
                                    <PersonAddIcon />
                                </Badge>
                            </IconButton>
                            <p>Sign up</p>
                        </MenuItem>
                    </Link> </>)}
            {username && (<>
                {/* <Typography sx={{color:"#fefefe"}}>{`Hello, ${username}`}</Typography> */}
                <MenuItem onClick={logout}>
                    <IconButton
                        size="large"
                        color="inherit"
                    >
                        <Badge color="error">
                            <LogoutIcon />
                        </Badge>
                    </IconButton>
                    <p>Logout</p>
                </MenuItem>

                <MenuItem>
                    <IconButton
                        size="large"
                        color="inherit"
                    >
                        <Badge badgeContent={17} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>Notifications</p>
                </MenuItem>
                <MenuItem onClick={handleProfileMenuOpen}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                        href='/user/savedposts'
                    >
                        <BookmarksIcon />
                        Saved
                    </IconButton>
                
                </MenuItem> 
                <MenuItem onClick={()=>showPosts()}>
                    <Link to={'/user/posts'} style={{ textDecoration: "none", color: "inherit", fontSize:'20px', fontWeight:'500' }} >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <BookmarksIcon />
                            <p>My Posts</p>
                        </IconButton>
                        
                    </Link>
                </MenuItem> 
                </>)}
        </Menu>
    );

    return (
        <>
        <Box>
            <AppBar sx={{ position: "sticky", top: '0px' }} elevation={0}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }} >
                    <Box sx={{ display: 'flex' }}>
                        <Link to={'/'}>
                            <Avatar src={logoImg} />
                        </Link>

                        <Search sx={{ display: { xs: 'none', md: 'block' } }} >
                            <SearchIconWrapper >
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                sx={{ width: 600 }}
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Search sx={{ display: { xs: 'block', md: 'none' } }}>
                            <SearchIconWrapper >
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
                        {
                            !username && (
                                <>
                                    <Button href='/login' variant="text" size="small" sx={{ color: '#fefefe', marginRight: '4px' }}>login</Button>
                                    <Button href='/signup' variant="text" size="small" sx={{ color: "#fefefe" }}>sign up</Button>
                                </>
                            )
                        }
                        {
                            username && (
                                <>
                                    <Typography sx={{ color: "#fefefe" }}>{`Hello, ${username}`}</Typography>
                                    <IconButton
                                        size="large"
                                        edge="end"
                                        aria-label="account of current user"
                                        aria-controls={menuId}
                                        aria-haspopup="true"
                                        onClick={handleProfileMenuOpen}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Button onClick={logout} variant="text" size="small" sx={{ color: "#fefefe" }}>
                                        <LogoutIcon />
                                    </Button>

                                </>
                            )
                        }
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                        {username && <Typography sx={{ color: "#fefefe" }}>{`HELLO, ${username.toUpperCase()} !`}</Typography>}
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
        <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={isLoggedOut}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="You are logged out"
        action={
            <>
            <IconButton href='/login' size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                <LoginIcon sx={{marginLeft:'6px',color:'#ffffff'}} />
            </IconButton>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
            </>
        }
    />
    </>
    );
}

export default Header;