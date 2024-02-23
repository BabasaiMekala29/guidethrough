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
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Link, useParams,Navigate } from 'react-router-dom';
import { useState } from 'react';
const pages = ['Blog', "Dont's", 'Tips', 'Q&A'];

function Endgame({uid}) {
    console.log(uid);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const {head,subhead} = useParams();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState('Blog');
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

    const handleBgColor = (page) =>{
        handleCloseNavMenu();
        setSelectedItem(page);
    }
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [upvote,setUpvote] = useState(0);
    const [downvote,setDownvote] = useState(0);
    const [likes,setLikes] = useState(0);
    const [redirect,setRedirect] = useState(false);
    async function createPost(e){
        e.preventDefault();
        // const data = new FormData();
        // data.set('title',title);
        // data.set('description',description);
        // data.set('upvote',upvote);
        // data.set('downvote',downvote);
        // data.set('likes',likes);
        // data.set('category',head);
        // data.set('subsection',subhead);
        const response = await fetch('http://127.0.0.1:4000/post',{
            method: 'POST',
            body:JSON.stringify({title,description,upvote,downvote,likes,category:head,subsection:subhead}),
            headers:{'Content-Type':'application/json'},
            credentials: 'include'
        })
        if(response.ok){
            setRedirect(true);
        }
        handleClose();
    }
    
    if(redirect){
        return <Navigate to='/category' />
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
                                    <MenuItem key={page} onClick={() => handleBgColor(page)} sx={{backgroundColor: selectedItem === page ? 'orange' : 'inherit' }}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>        
                            <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, width: 36, height: 36, marginLeft: 'auto',cursor:"pointer" }} />
                        </Box>
                        <Link style={{color:'#000000'}}>
                            <DriveFileRenameOutlineIcon onClick={handleClickOpen} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, width: 36, height: 36 }}  />
                        </Link>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'space-around', alignItems: 'center' } }}>
                            {pages.map((page) => (
                                <Button
                                    
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
            
        </>
        <React.Fragment>
      
        
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          PaperProps={{
            component: 'form',
            
          }}
        >
          <DialogTitle>Create Post</DialogTitle>
          <DialogContent>
            <Typography>Section: {head}</Typography>
            <Typography>Sub category: {subhead}</Typography>
          </DialogContent>
            {
                selectedItem==='Blog'&&(
                    <DialogContent>
                    <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="heading"
                    name="heading"
                    label="Add heading"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                    />
                    </DialogContent>
                )
            }
          <DialogContent>
            <TextField
              required
              margin="dense"
              id={selectedItem}
              name={selectedItem}
              label={`Add ${selectedItem}`}
              type="text"
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              value={description}
                onChange={e=>setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={createPost}>Post</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      
      </div>
    );
}
export default Endgame;
