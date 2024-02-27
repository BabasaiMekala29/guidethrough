import React from 'react'
import { useState,useEffect,useContext } from 'react'
import { UserContext } from '../UserContext'
import Header from './Header';
import { Container, Typography } from '@mui/material';
import UserPostElement from './UserPostElement';
function UserPosts() {
    const { userInfo, setUserInfo, isLoading } = useContext(UserContext);
    const [userPosts,setUserPosts] = useState([]);
    console.log(userInfo)
    const id = userInfo?._id || userInfo?.id;
    useEffect(() => {
        const fetchPosts = async () => {
            console.log("hiii")
            try {
                const response = await fetch(`http://127.0.0.1:4000/user/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                console.log(data);
                setUserPosts(data);

            } catch (error) {
                console.log(error);
            }
        };

        // if (userInfo?._id) {
            fetchPosts();
        // }
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>; // Render loading indicator if data is still being fetched
    }
  return (
    <div>
        <Header />
        {userInfo&&(
            // {console.log(userInfo)}
        // {userInfo.username}
        
        (<>
        <Typography variant='h6' paddingLeft={'12px'} paddingTop={'12px'}>{`${userInfo.username.toUpperCase()}'s Posts`}</Typography>
        <Container sx={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {userPosts.posts?.map(post => (
                <UserPostElement key={post._id} post={post} />
                // <>
                // <li key={post._id}>{post.title}</li>
                // <li key={post._id}>{post.description}</li> 
                // </> // Assuming each post has a 'title' field
            ))}
        </Container>
        </>)
        )}
        {!userInfo &&(
            <h1>Oops!! user logged out ;)</h1>
        )}
        
    </div>
  )
}

export default UserPosts