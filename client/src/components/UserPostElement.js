import * as React from 'react';
import { styled } from '@mui/material/styles';
import { format, formatISO9075 } from 'date-fns';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { PostContext } from '../PostContext';
import { Navigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    // transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function UserPostElement({ post }) {
    // console.log(post.author)

    const [openModal, setOpenModal] = useState(false); // State for modal open/close
    const [open, setOpen] = React.useState(false);
    const [openEditDilog, setOpenEditDilog] = React.useState(false);
    const [redirect, setRedirect] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [expanded, setExpanded] = React.useState(false);
    const { isLoading } = useContext(UserContext);
    const handleClickOpenEditDilog = () => {
        setOpenEditDilog(true);
    };

    const handleCloseEditDilog = () => {
        setOpenEditDilog(false);
    };
    const deletePost = async () => {

        try {
            const response = await fetch(`http://127.0.0.1:4000/post/${post._id}`);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setRedirect(true);
            }
        }
        catch (err) {
            console.log(err);
        }

        handleClose();

    }
    if (redirect) {
        return <Navigate to={'/user/posts'} />
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const editPost = async () => {
        console.log("hello");

        const response = await fetch(`http://127.0.0.1:4000/edit/post/${post._id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
            post = data;
            setRedirect(true);
        }
    }

    // const { postInfo, setPostInfo } = useContext(PostContext);

    const handleExpandClick = () => {
        console.log(post);
        // setPostInfo(post);
        setExpanded(!expanded);
        // return (<UserExpandedPost />)
        // console.log(expanded);
    };
    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    return (
        <Card sx={{ marginBottom: '8px', width: "80%" }}>
            <CardHeader
                title={post.title}
                subheader={format(new Date(post.createdAt), "dd-MMM-yyyy")}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {`${post.category}>${post.subcategory}>${post.section}`}
                </Typography>
            </CardContent>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {post.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
                {/* <IconButton> */}

                {/* <Link to={`/userpost/${post._id}`}> */}
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"

                >
                    <Typography onClick={handleOpenModal}>Read more</Typography>
                </ExpandMore>
                {/* </Link> */}
            </CardActions>


            {/* {expanded && <ExpandedPost post={post} />} */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '80%',
                    height: '80%',
                    position: 'absolute',
                    padding: '6px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fefefe',
                    borderRadius: '6px',
                    boxShadow: 24,
                    p: 4,
                    outline: 'none',
                }}>
                    {/* Modal Content */}
                    <IconButton onClick={handleCloseModal} sx={{ alignSelf: 'flex-end' }} aria-label="recipe">
                        <CancelIcon />
                    </IconButton>
                    <Card sx={{ margin: '15px' }}>
                        <CardHeader

                            title={post.title}
                            subheader={format(new Date(post.createdAt), "dd-MMM-yyyy")}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {`${post.category}>${post.subcategory}>${post.section}`}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {post.description}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton onClick={handleClickOpenEditDilog}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleClickOpen}>
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>

                    </Card>

                    <React.Fragment>

                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure, you want to Delete?"}
                            </DialogTitle>

                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={deletePost} autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                    <React.Fragment>
                        {/* <Button variant="outlined" onClick={handleClickOpenEditDilog}>
        Open form dialog
      </Button> */}
                        <Dialog
                            fullWidth
                            open={openEditDilog}
                            onClose={handleCloseEditDilog}
                            // PaperProps={{
                            //     component: 'form',
                            //     // onSubmit: (event) => {
                            //     //   event.preventDefault();
                            //     //   const formData = new FormData(event.currentTarget);
                            //     //   const formJson = Object.fromEntries(formData.entries());
                            //     //   const email = formJson.email;
                            //     //   console.log(email);
                            //     //   handleCloseEditDilog();
                            //     // },
                            // }}
                        >
                            <DialogTitle>Edit Post</DialogTitle>
                            <DialogContent>

                                <TextField

                                    required
                                    margin="dense"
                                    id="title"
                                    name="title"
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </DialogContent>
                            <DialogContent>

                                <TextField

                                    required
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={5}
                                    variant="standard"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseEditDilog}>Cancel</Button>
                                <Button onClick={editPost}>Save</Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                </div>
            </Modal>
        </Card>
    );
}
