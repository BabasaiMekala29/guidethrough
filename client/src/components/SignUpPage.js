import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from './Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom'
import { useState,useContext } from 'react';
import { UserContext } from '../UserContext';
const defaultTheme = createTheme();

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { userInfo, setUserInfo, isLoading } = useContext(UserContext);
  const userNameErrorEle = document.getElementById('userNameError');
  const emailErrorEle = document.getElementById('emailError');
  const passwordErrorEle = document.getElementById('passwordError');
  const handleSubmit = async (event) => {
    event.preventDefault();
    userNameErrorEle.textContent = '';
    emailErrorEle.textContent = '';
    passwordErrorEle.textContent = '';
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json();

      if (!(data.user)) {
        userNameErrorEle.textContent = data.errors.username;
        emailErrorEle.textContent = data.errors.email;
        passwordErrorEle.textContent = data.errors.password;

      }
      if (data.user) {
        setUserInfo(data.user);
        localStorage.setItem('user',JSON.stringify(data));
        setRedirect(true);
      }
    }
    catch (err) {
      console.log(err);
    }


  };

  if(redirect){
    return <Navigate to='/' />
}

  return (
    <>
    <Header />
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="user name"
                  value={username} onChange={e => setUsername(e.target.value)}
                  autoFocus
                />
                <Typography
                  color={'error'}
                  name="userNameError"
                  fullWidth
                  id="userNameError">

                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
                <Typography
                  color={'error'}
                  name="emailError"
                  fullWidth
                  id="emailError">

                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <Typography
                  color={'error'}
                  name="passwordError"
                  fullWidth
                  id="passwordError">

                </Typography>
              </Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
    </>
  );
}