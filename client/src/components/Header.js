import * as React from 'react';
import { Button, ButtonGroup, AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Avatar, Card, Container } from '@mui/material';
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
import { LightTooltip } from './LightToolTip';
import { Popover } from '@mui/material';
import { red } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import { formatDistanceToNow } from 'date-fns'
import SearchResultComp from './SearchResultComp';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

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
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const userid = userInfo?.id || userInfo?._id;
    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsLoggedOut(false);
    };


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

    const handleNotificationsClick = async (event) => {
        handleMenuClose();
        setNotificationsAnchorEl(event.currentTarget);
        try {
            const response = await fetch(`http://127.0.0.1:5000/user/${userid}/notifications`);
            if (!response.ok) {
                throw new Error('Failed to fetch post notifications');
            }

            const data = await response.json();
            console.log("nots ", data);
            setNotifications(data);
        }
        catch (error) {
            console.error('Error fetching post notifications:', error);
        }

    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
    };

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

    const showPosts = (e) => {
        handleMenuClose();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            console.log('Search value:', searchValue);
            window.location.href = `/search-results?query=${searchValue}`;
            // Here you can do whatever you want with the search value, like sending it to a function or API call
        }
    };

    const username = userInfo?.username;

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
                    size="medium"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    href='/user/savedposts'
                >
                    <BookmarksIcon />
                    <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Saved Posts</Typography>
                </IconButton>

            </MenuItem>

            <MenuItem onClick={() => showPosts()}>
                <Link to={'/user/posts'} style={{ textDecoration: "none", color: "inherit", fontSize: '20px', fontWeight: '500' }}>
                    <IconButton
                        size="medium"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AutoAwesomeMotionIcon />
                        <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>My Posts</Typography>
                    </IconButton>
                </Link>

            </MenuItem>

            {/* <MenuItem onClick={handleNotificationsClick}>
                <IconButton
                    size="medium"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <NotificationsIcon />
                    <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Notifications</Typography>
                </IconButton>

            </MenuItem> */}
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
                <MenuItem onClick={handleProfileMenuOpen}>
                    <IconButton
                        size="medium"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                        href='/user/savedposts'
                    >
                        <BookmarksIcon />
                        <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Saved Posts</Typography>
                    </IconButton>

                </MenuItem>
                <MenuItem onClick={() => showPosts()}>
                    <Link to={'/user/posts'} style={{ textDecoration: "none", color: "inherit", fontSize: '20px', fontWeight: '500' }} >
                        <IconButton
                            size="medium"
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <AutoAwesomeMotionIcon />
                            <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>My Posts</Typography>
                        </IconButton>

                    </Link>
                </MenuItem>
                <MenuItem onClick={handleNotificationsClick}>
                    <IconButton
                        size="medium"
                        color="inherit"
                    >
                        <NotificationsIcon />
                    </IconButton>
                    <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Notifications</Typography>
                </MenuItem>
                <MenuItem onClick={logout}>
                    <IconButton
                        size="medium"
                        color="inherit"
                    >
                        <LogoutIcon />
                    </IconButton>
                    <Typography sx={{ marginLeft: '5px', fontSize: '20px' }}>Logout</Typography>
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
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                            </Search>
                            <Search sx={{ display: { xs: 'block', md: 'none' } }}>
                                <SearchIconWrapper >
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchValue}
                                    onChange={e => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
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
                                        <Typography sx={{ color: "#fefefe", marginRight: '8px' }}>{`Hello, ${username}`}</Typography>
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
                                        <LightTooltip title="Notifications">
                                            <IconButton
                                                size="large"
                                                edge='end'
                                                color="inherit"
                                                onClick={handleNotificationsClick}
                                            >
                                                <NotificationsIcon />
                                            </IconButton>
                                        </LightTooltip>
                                        <LightTooltip title="Logout">
                                            <IconButton onClick={logout} size="large"
                                                edge='end'
                                                color="inherit">
                                                <LogoutIcon />
                                            </IconButton>
                                        </LightTooltip>

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
            {/* Notifications Popover */}
            <Popover
                open={Boolean(notificationsAnchorEl)}
                anchorEl={notificationsAnchorEl}
                onClose={handleNotificationsClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box marginTop={'0px'}>
                    {/* Your notifications content goes here */}
                    {/* You can render your notifications list or any other content */}
                    {(notifications.length === 0) ?
                        (<div style={{ display: 'flex', padding: '8px', gap: '10px', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {'!'}
                            </Avatar>
                            <p>No notifications found.</p>
                        </div>) :
                        notifications.map(notification => (

                            <React.Fragment key={notification._id}>
                                <IconButton sx={{ display: 'flex', padding: '10px', marginBottom: '10px', gap: '10px', alignItems: 'center' }}
                                    href={`/post/${notification.category}/${notification.subcategory}/${notification.section}/${notification.postDetails}`}
                                    target='_blank'>
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {notification.by[0].toUpperCase()}
                                    </Avatar>
                                    <Typography color={'text.primary'}>{`${notification.by} responded to your post as '${notification.commentText.substr(0, 3)}'...`}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'grey', alignSelf: 'flex-end' }}>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</Typography>
                                </IconButton>
                                <Divider />
                            </React.Fragment>

                        ))}
                </Box>
            </Popover>
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
                            <LoginIcon sx={{ marginLeft: '6px', color: '#ffffff' }} />
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