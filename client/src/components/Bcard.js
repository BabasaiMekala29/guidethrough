import React,{useContext} from 'react';
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
import { UserContext } from '../UserContext';
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
  const { userInfo } = useContext(UserContext)
  console.log("blog card  ", userInfo?.username)
  
  


  return (
    <Card sx={{ marginBottom: '16px', width: "80%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post.author.username[0].toUpperCase()}
          </Avatar>
        }
        
        title={post.author.username}
        subheader={format(new Date(post.createdAt), "dd-MMM-yyyy")}

      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.title}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        
         <ExpandMore>
         <Link to={`/post/${post.category}/${post.subcategory}/${post.section}/${post._id}`}>
          Read more
        </Link>
        </ExpandMore>
      </CardActions>
      
    </Card>
  );
}
