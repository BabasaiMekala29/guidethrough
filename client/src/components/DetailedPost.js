import React from 'react'
import { styled } from '@mui/material/styles';
import { format, formatDistanceToNow } from 'date-fns';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import Upvote from '../images/upvote.png';
import Downvote from '../images/downvote.png';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { ButtonGroup, Snackbar, TextField } from '@mui/material';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LightTooltip } from './LightToolTip';
import { Container } from '@mui/material';
import CommentComp from './CommentComp';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Divider from '@mui/material/Divider';


function DetailedPost() {
    const { userInfo } = useContext(UserContext)
    const { category, subcategory, section, id } = useParams();
    const [load, setLoad] = useState(true)
    const [post, setPost] = useState(null);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [openSaveSnack, setOpenSaveSnack] = React.useState(false);
    const [comment, setComment] = useState('');
    const [commentsData, setCommentsData] = useState([]);
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoted, setDownvoted] = useState(false);
    const [downvoteCount, setDownvoteCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    console.log("blog card  ", userInfo?.username)

    useEffect(() => {
        let isMounted = true; // Variable to track whether the component is mounted or not

        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/getpost/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                console.log(data);
                if (isMounted) { // Check if the component is still mounted before updating state
                    setPost(data);
                    setLoad(false);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
        return () => {
            isMounted = false; // Set isMounted to false when component unmounts
        };
    }, [id]);
    useEffect(() => {
        const fetchUpvoteData = async () => {
            try {
                // Fetch initial upvote count from backend
                const response = await fetch(`http://127.0.0.1:5000/post/${id}/upvotes`);

                const data = await response.json();
                setUpvoteCount(data); // Update upvote count state
            } catch (error) {
                console.error('Error fetching upvotes:', error);
            }
        };

        fetchUpvoteData();
    }, [id]);

    useEffect(() => {
        const fetchDownvoteData = async () => {
            try {
                // Fetch initial upvote count from backend
                const response = await fetch(`http://127.0.0.1:5000/post/${id}/downvotes`);

                const data = await response.json();
                setDownvoteCount(data); // Update upvote count state

            } catch (error) {
                console.error('Error fetching upvotes:', error);
            }
        };

        fetchDownvoteData();
    }, [id]);

    useEffect(() => {
        const fetchLikeData = async () => {
            try {
                // Fetch initial upvote count from backend
                const response = await fetch(`http://127.0.0.1:5000/post/${id}/likes`);

                const data = await response.json();
                setLikeCount(data); // Update upvote count state
            } catch (error) {
                console.error('Error fetching upvotes:', error);
            }
        };

        fetchLikeData();
    }, [id]);

    // const [saved,setSaved] = useState(post.saved);
    const commentLabel = (post?.section === 'Q&A') ? 'Responses:' : 'Comments:';
    const commentMesg = (post?.section === 'Q&A') ? 'No responses found' : 'No comments found';
    const butnText = (post?.section === 'Q&A') ? 'Send' : 'Comment';
    const userName = (!userInfo || !userInfo?.username) ? "X" : userInfo?.username[0].toUpperCase();
    useEffect(() => {
        // Fetch commentsData from server when component mounts
        if (post) {
            const fetchCommentsData = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/post/${id}/comment`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch comments data');
                    }
                    const data = await response.json();
                    setCommentsData(data);
                    console.log(data)
                } catch (error) {
                    console.error('Error fetching comments data:', error);
                }
            };
            fetchCommentsData();
        }
    }, [post]);

    if (load) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
    const handleUpvote = async () => {
        if (!userInfo || !userInfo.username) {
            setOpenSnack(true); // Assuming you have a Snackbar for login prompt
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:5000/post/${id}/upvote`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                // Update upvote status
                setUpvoted(!upvoted);
                // Update upvote count based on toggle
                setUpvoteCount(data.up);
                setDownvoteCount(data.down);
            }
        } catch (error) {
            console.error('Error toggling upvote:', error);
        }
    };

    const handleDownvote = async () => {
        if (!userInfo || !userInfo.username) {
            setOpenSnack(true); // Assuming you have a Snackbar for login prompt
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:5000/post/${id}/downvote`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // Update upvote status
                const data = await response.json();
                setDownvoted(!downvoted);
                // Update upvote count based on toggle
                // setDownvoteCount(prevCount => downvoted ? prevCount - 1 : prevCount + 1);
                setUpvoteCount(data.up);
                setDownvoteCount(data.down);
            }
        } catch (error) {
            console.error('Error toggling upvote:', error);
        }
    };

    const handleLike = async () => {
        if (!userInfo || !userInfo.username) {
            setOpenSnack(true); // Assuming you have a Snackbar for login prompt
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:5000/post/${id}/like`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // Update upvote status
                const data = await response.json();
                setLiked(!liked);
                // Update upvote count based on toggle
                // setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
                setLikeCount(data);
            }
        } catch (error) {
            console.error('Error toggling upvote:', error);
        }
    };

    const handleCloseSaveSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSaveSnack(false);
    };



    const handleSave = async () => {
        console.log(userInfo)
        if (!userInfo || !userInfo?.username) {
            setOpenSnack(true);
            return;
        }
        // console.log(post?._id)
        if (post) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/post/${id}/save`, {
                    method: 'PUT',
                    body: JSON.stringify({ user: userInfo?._id || userInfo?.id }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setOpenSaveSnack(true);
                    // return;
                }
                console.log(data);


            } catch (error) {
                console.error('Error saving post:', error);
            }
        }

    };
    const commentField = document.getElementById('commentText');
    const addComment = async (comment) => {

        if (!userInfo || !userInfo?.username) {
            setOpenSnack(true);
            return;
        }
        console.log('title ', post._id);
        try {
            const response = await fetch(`http://127.0.0.1:5000/post/${id}/comment`, {
                method: 'PUT',
                body: JSON.stringify({ user: userInfo?.username, comment }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setCommentsData(data);
                await fetch(`http://127.0.0.1:5000/post/${id}/notify`, {
                    method: 'PUT',
                    body: JSON.stringify({ user: post.author._id, post: post._id, by: userInfo?.username, comment, category: post.category, subcategory: post.subcategory, section: post.section }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                
            }
            


        } catch (error) {
            console.error('Error commenting post:', error);
        }

    }

    const handleShare = () => {
        const postLink = `http://localhost:3000/post/${category}/${subcategory}/${section}/${id}`; // Replace with your actual post link

        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = postLink;
        document.body.appendChild(tempInput);

        // Select and copy the text
        tempInput.select();
        document.execCommand('copy');

        // Remove the temporary input element
        document.body.removeChild(tempInput);

        console.log('Post link copied to clipboard');
        // You can show a success message or perform any other action here
    };
    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };
    return (
        <div>
            <Header />
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
                message="Please login to perform this action"
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" href='/login' onClick={handleCloseSnack}>
                            Login
                        </Button>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnack}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
            <Snackbar
                open={openSaveSnack}
                autoHideDuration={6000}
                onClose={handleCloseSaveSnack}
                message="Post saved"
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" href='/user/savedposts' onClick={handleCloseSaveSnack}>
                            View saved
                        </Button>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSaveSnack}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />

            <Card sx={{ margin: 'auto', marginTop: '0', width: '75%', overflow: 'scroll' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {post?.author.username[0].toUpperCase()}

                        </Avatar>
                    }
                    // action={
                    //   <IconButton aria-label="settings">
                    //     <MoreVertIcon />
                    //   </IconButton>
                    // 
                    title={post?.author.username}
                    subheader={format(new Date(post?.createdAt), "dd-MMM-yyyy")}
                />
                <CardContent>
                    <Typography variant='h5'>{post?.title.toUpperCase()}</Typography>
                    <Typography variant="h6" color="text.secondary">
                        {post?.description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>

                    {post?.section !== 'Q&A' && (<><LightTooltip title="Upvote">
                        <IconButton aria-label="add to favorites" sx={{ display: 'flex' }} onClick={handleUpvote}>
                            <img src={Upvote} height={'36px'} width={'36px'} />
                            <Typography>{upvoteCount}</Typography>
                        </IconButton>
                    </LightTooltip>
                        <LightTooltip title="Downvote">
                            <IconButton aria-label="share" sx={{ display: 'flex' }} onClick={handleDownvote}>
                                <img src={Downvote} height={'36px'} width={'36px'} />
                                <Typography>{downvoteCount}</Typography>
                            </IconButton>
                        </LightTooltip>
                        <LightTooltip title="Like">
                            <IconButton aria-label="add to favorites" onClick={handleLike}>

                                <FavoriteIcon />
                                <Typography>{likeCount}</Typography>
                            </IconButton>
                        </LightTooltip>
                        <LightTooltip title="Save">
                            <IconButton onClick={handleSave} >
                                <BookmarksIcon />
                            </IconButton>
                        </LightTooltip></>)}

                    <LightTooltip title="Share">
                        <IconButton aria-label="share" onClick={handleShare}>
                            <ShareIcon />
                        </IconButton>
                    </LightTooltip>
                </CardActions>
                <Typography variant='h6' padding={'10px'}>{commentLabel} </Typography>
                <Container sx={{ display: 'flex', flexDirection: 'column', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', flexGrow: 1, marginBottom: '12px' }}>
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {userName}
                        </Avatar>
                        <TextField id="commentText" label={`Add a ${commentLabel.substring(0, commentLabel.length - 2)}...`} variant="standard" sx={{ marginLeft: '10px', width: '100%' }} value={comment} onChange={e => setComment(e.target.value)} />
                    </div>

                    {comment.length > 0 && (
                        <ButtonGroup variant='text' sx={{ alignSelf: 'flex-end' }}>
                            <Button onClick={() => { commentField.value = ''; setComment('') }}>Cancel</Button>
                            <Button onClick={() => { commentField.value = ''; setComment(''); addComment(comment) }} >{butnText}</Button>
                        </ButtonGroup>
                    )}
                    <div>
                        {
                            (commentsData.length === 0) ?
                                (<p style={{ textAlign: 'center' }}>{commentMesg}</p>) :
                                commentsData.map(cmt => (<>
                                    <CommentComp key={cmt._id} cmt={cmt} post={post} />
                                    <Divider />
                                </>
                                ))}
                    </div>
                </Container>
            </Card>
        </div>
    )
}

export default DetailedPost