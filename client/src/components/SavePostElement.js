import React, { useState, useContext } from 'react'
import { format } from 'date-fns';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { Container, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { UserContext } from '../UserContext';
import { Snackbar } from '@mui/material';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LightTooltip } from './LightToolTip';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

function SavePostElement({ post }) {
  const { userInfo } = useContext(UserContext);
  const id = userInfo?._id || userInfo?.id;
  const [openSnack, setOpenSnack] = React.useState(false);
  const unsavePost = async () => {
    console.log(id);
    try {
      const response = await fetch(`http://127.0.0.1:5000/unsavepost/${post._id}`, {
        method: 'PUT',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setOpenSnack(true);
        // setRedirect(true);
      }
    }
    catch (err) {
      console.log(err);
    }
    console.log('iui');
  }
  // if (redirect) {

  //     return <Navigate to={'/user/savedposts'} />
  // }
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };
  return (
    // <div>{post.description}</div>
    <>
      <Card sx={{ marginBottom: '8px', width: "80%", display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={post.title}
          subheader={format(new Date(post.createdAt), "dd-MMM-yyyy")}

        />
        <CardContent>
          <Typography color="text.secondary">
            {`${post.category}>${post.subcategory}>${post.section}`}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            {post.description}
          </Typography>
          {post.section === 'Q&A' && (<Typography marginTop={'20px'}>Responses: </Typography>)}
          <Container>
            {post.comments?.map(cmt => (
              (cmt.booked === true) &&
              <Card sx={{ marginBottom: '8px', width: "80%" }} elevation={0}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {cmt.user[0].toUpperCase()}
                    </Avatar>
                  }

                  title={cmt.user}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {cmt.comment}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Container>
        </CardContent>
        <LightTooltip title="Unsave">
          <IconButton onClick={unsavePost} sx={{ alignSelf: 'flex-end' }} aria-label="recipe">
            <BookmarkRemoveIcon />
          </IconButton>
        </LightTooltip>
      </Card>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message="Post unsaved"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" href='/user/savedposts' onClick={handleCloseSnack}>
              View saved
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
    </>
  )
}

export default SavePostElement