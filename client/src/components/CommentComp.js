import React, { useState,useEffect, useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import { format, formatDistanceToNow } from 'date-fns';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import Upvote from '../images/upvote.png';
import Downvote from '../images/downvote.png';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { LightTooltip } from './LightToolTip';
import { CardActions } from '@mui/material';
import { UserContext } from '../UserContext';
import {Snackbar } from '@mui/material';
import {IconButton,Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CommentComp({ cmt, post }) {
  const { userInfo } = useContext(UserContext)
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoted, setDownvoted] = useState(false);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSaveSnack, setOpenSaveSnack] = React.useState(false);
  useEffect(() => {
    const fetchUpvoteData = async () => {
        try {
            // Fetch initial upvote count from backend
            const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment/${cmt._id}/upvotes`);
            console.log(`post/${post._id}/comment/${cmt._id}`);
            const data = await response.json();
            setUpvoteCount(data); // Update upvote count state
            console.log("uvote",data);
        } catch (error) {
            console.error('Error fetching upvotes:', error);
        }
    };

    fetchUpvoteData();
}, []);

useEffect(() => {
    const fetchDownvoteData = async () => {
        try {
            // Fetch initial upvote count from backend
            const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment/${cmt._id}/downvotes`);
            
            const data = await response.json();
            setDownvoteCount(data); // Update upvote count state
            console.log("dvote",data);
        } catch (error) {
            console.error('Error fetching upvotes:', error);
        }
    };

    fetchDownvoteData();
}, []);

const handleUpvote = async () => {
  if (!userInfo || !userInfo.username) {
      setOpenSnack(true); // Assuming you have a Snackbar for login prompt
      return;
  }
  try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment/${cmt._id}/upvote`, {
          method: 'PUT',
          body: JSON.stringify({ user: userInfo?.username }),
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.ok) {
          // Update upvote status
          const data = await response.json();
          setUpvoted(!upvoted);
          // Update upvote count based on toggle
          setUpvoteCount(data.up);
          setDownvoteCount(data.down);
          // setUpvoteCount(prevCount => upvoted ? prevCount - 1 : prevCount + 1);
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
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/comment/${cmt._id}/downvote`, {
          method: 'PUT',
          body: JSON.stringify({ user: userInfo?.username }),
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.ok) {
        const data = await response.json();
          // Update upvote status
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


  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const handleCloseSaveSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSaveSnack(false);
  };

  const handleSave = async ()=>{
    console.log("cmt",cmt)
    if (!userInfo || !userInfo?.username) {
      setOpenSnack(true);
      return;
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/post/${post._id}/save`, {
        method: 'PUT',
        body: JSON.stringify({ user: userInfo?._id || userInfo?.id,cmtId:cmt._id }),
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
  }

  return (
    <>
      <Card sx={{ marginBottom: '8px', width: "80%" }} elevation={0}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {cmt.user[0].toUpperCase()}
            </Avatar>
          }

          title={cmt.user}
          subheader={formatDistanceToNow(new Date(cmt.createdAt), { addSuffix: true })}
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {cmt.comment}
          </Typography>
        </CardContent>
        {post.section === 'Q&A' && (<CardActions disableSpacing>
          <LightTooltip title="Upvote">
            <IconButton aria-label="add to favorites" sx={{ display: 'flex' }} onClick={handleUpvote}>
              <img src={Upvote} height={'36px'} width={'36px'} />
              <Typography>{upvoteCount}</Typography>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Downvote">
            <IconButton aria-label="share" sx={{ display: 'flex' }}  onClick={handleDownvote}>
              <img src={Downvote} height={'36px'} width={'36px'} />
              <Typography>{downvoteCount}</Typography>
            </IconButton>
          </LightTooltip>
          <LightTooltip title="Save">
            <IconButton onClick={handleSave} >
              <BookmarksIcon />
            </IconButton>
          </LightTooltip></CardActions>)}
      </Card>
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
    </>
  )
}

export default CommentComp