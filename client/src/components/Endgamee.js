import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Header from './Header';
import BlogCard from './BlogCard';
import { Link, useParams } from 'react-router-dom';
import PostModal from './PostModal';
import { useState, useEffect } from 'react';

const pages = ['Blog', "Dont's", 'Tips', 'Q&A'];

function Endgame() {
    const { head, subhead } = useParams();
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState('Blog');
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            console.log("hiii")
            try {
                const response = await fetch(`http://127.0.0.1:4000/category/${head}/${subhead}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                console.log(data);
                setPosts(data);

            } catch (error) {
                console.log(error);
            }
        };

        fetchPosts();
    }, [head, subhead]);

    const handleClickOpen = () => {
        setOpen(true);
        console.log(selectedItem);
        return (
            <PostModal />
        )
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleBgColor = (page) => {
        handleCloseNavMenu();
        setSelectedItem(page);
    }

    return (
        <div>
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
                                        <MenuItem key={page} onClick={() => handleBgColor(page)} sx={{ backgroundColor: selectedItem === page ? 'orange' : 'inherit' }}>
                                            <Typography textAlign="center">{page}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>

                                <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, width: 36, height: 36, marginLeft: 'auto', cursor: "pointer" }} />

                            </Box>
                            <Link style={{ color: '#000000' }} to={`/category/${head}/${subhead}/${selectedItem}/postt`}>
                                <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: 36, height: 36 }} />
                            </Link>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'space-around', alignItems: 'center' } }}>
                                {pages.map((page) => (
                                    <Button

                                        key={page}
                                        onClick={() => setSelectedItem(page)}
                                        sx={{ my: 2, color: '#000000', display: 'block', backgroundColor: selectedItem === page ? 'orange' : 'inherit' }}
                                    >
                                        {page}
                                    </Button>
                                ))}

                            </Box>


                        </Toolbar>
                    </Container>
                </AppBar>

            </>
            <>
                <Typography paddingLeft={'10px'} paddingTop={'10px'}>{head}{' > '}{subhead}</Typography>
            </>
            <Container sx={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {
                    (posts.length === 0) ?
                        (<p>No posts found.</p>) :

                        posts.map(post => (
                            (post.section===selectedItem)&&
                            <BlogCard key={post._id} post={post} />
                        ))}
                
            </Container>

        </div>
    );
}
export default Endgame;
