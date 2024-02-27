import React,{useState, useContext, useEffect} from 'react'
import { format } from 'date-fns';
import Header from './Header';
import { Card,CardHeader,CardContent,Typography, CardActions, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PostContext } from '../PostContext';
import { UserContext } from '../UserContext';
function UserExpandedPost() {
    const {postInfo,setPostInfo} = useContext(PostContext);
    const {isLoading} = useContext(UserContext)
    console.log(postInfo)
    // setPostInfo(postInfo);
//   return (
//     <div>{postInfo.title}</div>
//   )
if (isLoading) {
    return <div>Loading...</div>; // Render loading indicator if data is still being fetched
}
return (
    <>
        <Header />
        {/* <Container sx={{paddingTop:'12px', display:'flex',justifyContent:'center'}}> */}
        {postInfo &&(<Card sx={{ margin: '15px' }}>
            <CardHeader
                
                title={postInfo.title}
                subheader={format(new Date(postInfo.createdAt),"dd-MMM-yyyy")}
            />

            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {postInfo.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton>
                    <EditIcon />
                </IconButton>
                <IconButton>
                    <DeleteIcon />
                </IconButton>
            </CardActions>

        </Card>)}
        {!postInfo&&(
            <h1>Fetching...</h1>
        )}
        {/* </Container> */}
    </>
)
}

export default UserExpandedPost