import * as React from 'react';
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
import Modal from '@mui/material/Modal';
import { ButtonGroup, Snackbar, TextField } from '@mui/material';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LightTooltip } from './LightToolTip';
import CommentIcon from '@mui/icons-material/Comment';
import { Container } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CommentComp from './CommentComp';
import { Link } from 'react-router-dom';

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

export default function BlogCard({ key, post }) {
  // console.log(post.author)
  const { userInfo } = useContext(UserContext)
  console.log("blog card  ", userInfo?.username)
  const [expanded, setExpanded] = React.useState(false);
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [saveStatus, setSaveStatus] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(post.upvote);
  const [canUpvote, setCanUpvote] = useState(true);
  const [downvoteCount, setDownvoteCount] = useState(post.downvote);
  const [canDownvote, setCanDownvote] = useState(true);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [canLike, setLike] = useState(true);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [updatedPostData, setUpdatedPostData] = useState(post);
  const [openSaveSnack, setOpenSaveSnack] = React.useState(false);
  const [comment, setComment] = useState('');
  const [commentsData, setCommentsData] = useState([]);
  // const [saved,setSaved] = useState(post.saved);
  const commentLabel = (post.section === 'Q&A') ? 'Responses:' : 'Comments:';
  const commentMesg = (post.section === 'Q&A') ? 'No responses found' : 'No comments found';
  const butnText = (post.section === 'Q&A') ? 'Send' : 'Comment';
  useEffect(() => {
    // Fetch commentsData from server when component mounts
    const fetchCommentsData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments data');
        }
        const data = await response.json();
        setCommentsData(data);
      } catch (error) {
        console.error('Error fetching comments data:', error);
      }
    };

    fetchCommentsData();
  }, []);

  console.log(commentsData)

  const userName = (!userInfo || !userInfo?.username) ? "X" : userInfo?.username[0].toUpperCase()
  const handleCloseSaveSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSaveSnack(false);
  };
  const handleUpvote = async () => {
    if (!userInfo || !userInfo?.username) {

      setOpenSnack(true);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/upvote`, {
        method: 'PUT',
        body: canUpvote ? JSON.stringify({ upvote: upvoteCount + 1, user: userInfo?.username }) : JSON.stringify({ upvote: upvoteCount - 1, user: userInfo?.username }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUpdatedPostData(data);

        if (canUpvote) {
          setUpvoteCount(upvoteCount + 1);
          setCanUpvote(false);
        }
        else {
          setUpvoteCount(upvoteCount - 1);
          setCanUpvote(true);
        }



        // console.log(response)
      }

    } catch (error) {
      console.error('Error upvoting post:', error);

    }
  };
  const handleDownvote = async () => {
    if (!userInfo || !userInfo?.username) {
      setOpenSnack(true);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/downvote`, {
        method: 'PUT',
        body: canDownvote ? JSON.stringify({ downvote: downvoteCount + 1, user: userInfo?.username }) : JSON.stringify({ downvote: downvoteCount - 1, user: userInfo?.username }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUpdatedPostData(data);
        if (canDownvote) {
          setDownvoteCount(downvoteCount + 1);
          setCanDownvote(false)
        }
        else {
          setDownvoteCount(downvoteCount - 1);
          setCanDownvote(true)
        }

        // console.log(response)
      }

    } catch (error) {
      console.error('Error upvoting post:', error);

    }
  };
  const handleLike = async () => {
    if (!userInfo || !userInfo?.username) {
      setOpenSnack(true);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/like`, {
        method: 'PUT',
        body: canLike ? JSON.stringify({ likes: likesCount + 1, user: userInfo?.username }) : JSON.stringify({ likes: likesCount - 1, user: userInfo?.username }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUpdatedPostData(data);
        if (canLike) {
          setLikesCount(likesCount + 1);
          setLike(false)
        }
        else {
          setLikesCount(likesCount - 1);
          setLike(true)
        }

        // console.log(response)
      }

    } catch (error) {
      console.error('Error upvoting post:', error);

    }
  };

  const handleSave = async () => {
    console.log(userInfo)
    if (!userInfo || !userInfo?.username) {
      setOpenSnack(true);
      return;
    }
    console.log(post._id)
    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/save`, {
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
      console.error('Error upvoting post:', error);
    }

  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
    // setExpanded(true); 
    // const postId = post._id; // Get the post ID
    // const postLink = `http://localhost:3000//${post.category}/${post.subcategory}/${post.section}/${postId}`; // Generate the link using post ID
    // const readMoreLink = document.getElementById('readMoreLink');
    // readMoreLink.setAttribute('href', postLink);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleExpandClick = () => {
    console.log(post);
    setExpanded(!expanded);
    // return (<ExpandedPost />)
    // console.log(expanded);
  };
  const commentField = document.getElementById('commentText');
  const addComment = async (comment) => {

    if (!userInfo || !userInfo?.username) {
      setOpenSnack(true);
      return;
    }
    // console.log(comment)
    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment`, {
        method: 'PUT',
        body: JSON.stringify({ user: userInfo?.username, comment }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCommentsData(data);
        // return;
      }
      console.log(data);


    } catch (error) {
      console.error('Error upvoting post:', error);
    }

  }

  const handleShare = () => {
    const postLink = `http://localhost:3000/category/Travel/Solo Travel/${post.id}`; // Replace with your actual post link

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



  return (
    <Card sx={{ marginBottom: '16px', width: "80%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post.author.username[0].toUpperCase()}
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={post.author.username}
        subheader={format(new Date(post.createdAt), "dd-MMM-yyyy")}

      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.title}
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

        {/* <Link to={`/post/${post._id}`}> */}
         <ExpandMore
          /*expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more" */

        > 
          {/* <Link to={`/post/${post._id}`} onClick={handleOpenModal}>Read more</Link> */}
          <Typography onClick={handleOpenModal}>Read more</Typography>
          {/* <Link id="readMoreLink" to={`/${post.category}/${post.subcategory}/${post.section}/${post._id}`} onClick={handleOpenModal}>Read more</Link> */}
          {/* <Link to={`/${post.category}/${post.subcategory}/${post.section}/${post._id}`} onClick={handleOpenModal}>Read more</Link> */}

        </ExpandMore>
        {/* </Link> */}
      </CardActions>
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
          <Card sx={{ margin: 'auto', marginTop: '0', width: '75%', overflow: 'scroll' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {post.author.username[0].toUpperCase()}
                  {/* X */}
                </Avatar>
              }
              // action={
              //   <IconButton aria-label="settings">
              //     <MoreVertIcon />
              //   </IconButton>
              // }
              title={post.author.username}
              subheader={format(new Date(post.createdAt), "dd-MMM-yyyy")}
            />
            <CardContent>
              <Typography variant='h5'>{post.title.toUpperCase()}</Typography>
              <Typography variant="h6" color="text.secondary">
                {post.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>

              {post.section !== 'Q&A' && (<><LightTooltip title="Upvote">
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
                    <Typography>{likesCount}</Typography>
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
                    commentsData.map(cmt => (
                      <CommentComp key={cmt._id} cmt={cmt} post={post} />
                    ))}
              </div>
            </Container>
          </Card>
        </div>
      </Modal>
      {/* {!userInfo.username &&(<Navigate to={'/'} />)} */}
    </Card>
  );
}
