import { Container } from '@mui/material'
import React, { useState,useEffect,useContext } from 'react'
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Header from './Header';
import Upvote from '../images/upvote.png';
import Downvote from '../images/downvote.png';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import { useParams } from 'react-router-dom';

import { UserContext } from '../UserContext';
import { PostContext } from '../PostContext';
export default function ExpandedPost() {
    const {postInfo} = useContext(PostContext);
    console.log(postInfo);
    // const [postData,setPostData] = useState([])
    const [saveStatus,setSaveStatus] = useState(false);
    const [likeStatus,setLikeStatus] = useState(false);

    

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }));
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    // console.log(postData.reqPost?.title)
    return (
        <>
            <Header />
            {/* <Container sx={{paddingTop:'12px', display:'flex',justifyContent:'center'}}> */}
            <Card sx={{ margin: '15px' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {postInfo.author.username[0].toUpperCase()}
                            {/* X */}
                        </Avatar>
                    }
                    // action={
                    //   <IconButton aria-label="settings">
                    //     <MoreVertIcon />
                    //   </IconButton>
                    // }
                    title={postInfo.author.username}
                    subheader={format(new Date(postInfo.createdAt),"dd-MMM-yyyy")}
                />

                <CardContent>
                    <Typography variant='h6'>{postInfo.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {postInfo.description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites" sx={{display:'flex'}}>
                        <img src={Upvote} height={'36px'} width={'36px'} />
                        <Typography>{postInfo.upvote}</Typography>
                    </IconButton>
                    <IconButton aria-label="share" sx={{display:'flex'}}>
                        <img src={Downvote} height={'36px'} width={'36px'} />
                        <Typography>{postInfo.downvote}</Typography>
                    </IconButton>
                    <IconButton aria-label="add to favorites">
                    {
                            likeStatus? (
                                <IconButton onClick={()=>setLikeStatus(false)}>
                                    <FavoriteIcon />
                                </IconButton>
                                ):(
                                    <IconButton onClick={()=>setLikeStatus(true)}>
                                    <FavoriteBorderOutlinedIcon />
                                </IconButton>
                                )
                        }
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton>    
                        {
                            saveStatus? (
                                <IconButton onClick={()=>setSaveStatus(false)}>
                                    <BookmarksIcon />
                                </IconButton>
                                ):(
                                    <IconButton onClick={()=>setSaveStatus(true)}>
                                    <BookmarksOutlinedIcon />
                                </IconButton>
                                )
                        }
                        
                    </IconButton>
                </CardActions>

            </Card>
            {/* </Container> */}
        </>
    )
}

