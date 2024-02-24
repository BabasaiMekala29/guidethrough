// import React from 'react'
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import { useState } from 'react';
// import { Navigate, useParams } from 'react-router-dom';
// function PostModal() {
//     const [open, setOpen] = React.useState(true);
//     const { head, subhead, section } = useParams();

//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setRedirect(true);
//         setOpen(false);
//     };

//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [upvote, setUpvote] = useState(0);
//     const [downvote, setDownvote] = useState(0);
//     const [likes, setLikes] = useState(0);
//     const [redirect, setRedirect] = useState(false);

//     const titleErrorEle = document.getElementById('titleError');
//     const descriptionErrorEle = document.getElementById('descriptionError');

//     async function createPost(e) {
//         e.preventDefault();
//         titleErrorEle.textContent = '';
//         descriptionErrorEle.textContent = '';
//         const response = await fetch('http://127.0.0.1:4000/post', {
//             method: 'POST',
//             body: JSON.stringify({ title, description, upvote, downvote, likes, category: head, subcategory: subhead, section }),
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include'
//         })
//         const data = await response.json();
//         if (data.errors) {
//             titleErrorEle.textContent = data.errors.title;
//             descriptionErrorEle.textContent = data.errors.description;

//         }
//         else {
//             setRedirect(true);
//         }
//         // if(response.ok){
//         //     setRedirect(true);
//         // }
//         handleClose();
//     }

//     if (redirect) {
//         return <Navigate to={`/category/${head}/${subhead}`} />
//     }

//     return (
//         <div>
//             <Dialog
//                 open={open}
//                 onClose={handleClose}
//                 fullWidth
//                 PaperProps={{
//                     component: 'form',

//                 }}
//             >
//                 <DialogTitle>Create Post</DialogTitle>
//                 <DialogContent>
//                     <Typography>Section: {head}</Typography>
//                     <Typography>Sub category: {subhead}</Typography>
//                 </DialogContent>
//                 {
//                     section === 'Blog' && (
//                         <DialogContent>
//                             <TextField
//                                 autoFocus
//                                 required
//                                 margin="dense"
//                                 id="heading"
//                                 name="heading"
//                                 label="Add heading"
//                                 type="text"
//                                 fullWidth
//                                 variant="standard"
//                                 value={title}
//                                 onChange={e => setTitle(e.target.value)}
//                             />
//                             <Typography
//                                 color={'error'}
//                                 name="titleError"
//                                 fullWidth
//                                 id="titleError">

//                             </Typography>
//                         </DialogContent>
//                     )
//                 }
//                 <DialogContent>
//                     <TextField
//                         required
//                         margin="dense"
//                         id={section}
//                         name={section}
//                         label={`Add ${section}`}
//                         type="text"
//                         fullWidth
//                         multiline
//                         rows={5}
//                         variant="outlined"
//                         value={description}
//                         onChange={e => setDescription(e.target.value)}  
//                     />
//                     <Typography
//                                 color={'error'}
//                                 name="descriptionError"
//                                 fullWidth
//                                 id="descriptionError">

//                             </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose}>Cancel</Button>
//                     <Button onClick={createPost}>Post</Button>
//                 </DialogActions>
//             </Dialog>
//             {/* <Typography paddingLeft={'10px'} paddingTop={'10px'}>{head}{' > '}{subhead}</Typography> */}
//         </div>
//     )
// }

// export default PostModal
import React from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

function PostModal() {
    const [open, setOpen] = React.useState(true);
    const { head, subhead, section } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [upvote, setUpvote] = useState(0);
    const [downvote, setDownvote] = useState(0);
    const [likes, setLikes] = useState(0);
    const [redirect, setRedirect] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setRedirect(true);
        setOpen(false);
    };

    async function createPost(e) {
        e.preventDefault();
        setTitleError('');
        setDescriptionError('');
        const response = await fetch('http://127.0.0.1:4000/post', {
            method: 'POST',
            body: JSON.stringify({ title, description, upvote, downvote, likes, category: head, subcategory: subhead, section }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (data.errors) {
            console.log(data.errors)
            setTitleError(data.errors.title);
            setDescriptionError(data.errors.description);
        }
        else {
            console.log(data);
            setRedirect(true);
            handleClose();
        }   
    }
    
    if (redirect) {
        return <Navigate to={`/category/${head}/${subhead}`} />
    }

    return (
        <div>
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
                    <Typography>{head}{'>'}{subhead}{'>'}{section}</Typography>
                </DialogContent>
                
                        <DialogContent>
                            <TextField
                               
                                required
                                margin="dense"
                                id="heading"
                                name="heading"
                                label="Add heading"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <Typography color="error">{titleError}</Typography>
                        </DialogContent>
                    
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        id={section}
                        name={section}
                        label={`Add ${section}`}
                        type="text"
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        value={description}
                        onChange={e => setDescription(e.target.value)}  
                    />
                    <Typography color="error">{descriptionError}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={createPost}>Post</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default PostModal;
