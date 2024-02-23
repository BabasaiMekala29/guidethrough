import * as React from 'react';
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
import AdbIcon from '@mui/icons-material/Adb';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Header from './Header';
import Element from './Element';
import { Link, useParams } from 'react-router-dom';
const pages = ['Blog', "Dont's", 'Tips', 'Q&A'];

function Endgame() {
    const {head,subhead} = useParams();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);
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

    return (
        <>
            <Header />

            <AppBar position="static" sx={{ backgroundColor: "#fefefe", color: '#000000' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

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
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                            <DriveFileRenameOutlineIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, width: 36, height: 36, marginLeft: 'auto' }} />
                        </Box>
                        <Link to={`/category/${head}/${subhead}/post`} style={{color:'#000000'}}>
                            <DriveFileRenameOutlineIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: 36, height: 36 }}  />
                        </Link>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'space-around', alignItems: 'center' } }}>
                            {pages.map((page) => (
                                <Button
                                    // href={`/category/${head}/${subhead}/${page}`}
                                    key={page}
                                    onClick={() => setSelectedItem(page)}
                                    sx={{ my: 2, color: '#000000', display: 'block',backgroundColor: selectedItem === page ? 'orange' : 'inherit'  }}
                                >
                                    {page}
                                </Button>
                            ))}

                        </Box>


                    </Toolbar>
                </Container>
            </AppBar>
            {/* <Element /> */}
        </>
    );
}
export default Endgame;
