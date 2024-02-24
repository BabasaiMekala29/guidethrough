import * as React from 'react';
import { styled } from '@mui/material/styles';
import { format,formatISO9075 } from 'date-fns';
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
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Header from './Header';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandedPost from './ExpandedPost';
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

export default function BlogCard({key,post}) {
  console.log(post.author)
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    console.log(post);
    return (
      <ExpandedPost post={post} high={"WAKANDA"} />
    )
    // setExpanded(!expanded);
  };

  return (
    <Card sx={{marginBottom:'8px', width:"80%"}}>
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
        title= {post.author.username}
        subheader={format(new Date(post.createdAt),"dd-MMM-yyyy")}
      />
      
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
            
        <Link to={`/post/${post._id}`}>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Typography>Read more</Typography>
          </ExpandMore>
          </Link>
      </CardActions>
    
    </Card>
  );
}
