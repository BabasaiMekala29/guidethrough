import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupPage from './components/SignUpPage.js';
import LoginPage from './components/LoginPage';
import CategoryPage from './components/CategoryPage.js';
import {UserContextProvider} from './UserContext.js'
import HomePage from './components/HomePage.js';
import Endgamee from './components/Endgamee.js'
import { useEffect,useContext } from 'react';
import { UserContext } from './UserContext.js';
// import { UserContextProvider } from './UserContext.js';
import Vegs from './components/Vegs.js';
function App() {
  // const {userInfo} = useContext(UserContext);
  // const isLoggedIn = !!userInfo?.username;
  // const username = userInfo?.username;
  // console.log("app ",isLoggedIn);
  const theme = createTheme({
    palette: {
      primary: {
        main: '#cd5909'
        // main: '#2b6278'
      },
      secondary: {
        main: '#FFDB58'
      }
    },
    typography:{
      fontFamily:'Quicksand',
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
      fontWeightBold: 700,
  
    }
  })
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        
        <UserContextProvider>
        <Router>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/signup' element={<ConditionalRoute a={<HomePage /> } b={<LoginPage />}  />} />
              <Route path='/login' element={<ConditionalRoute a={<HomePage /> } b={<LoginPage />}  />} />
              <Route path='/category' element={<CategoryPage />} />
              <Route path='/category/:head/:subhead' element={<ConditionalRouteTwo />} />
              {/* <Route path='/end' element={<Endgame />} /> */}
              {/* <Route path='/category/:head/:subhead/post' element={<PostPage />} /> */}
              {/* <Route path='/category/:head/:subhead/:page' element={<SectionPage />} /> */}
            </Routes>
        </Router>
            </UserContextProvider>
        
      </ThemeProvider>
    </div>
  );
}

function ConditionalRoute({a,b}) {
  const { userInfo, isLoading } = useContext(UserContext);

  if (isLoading) {
      return <div>Loading...</div>; // Render loading indicator if data is still being fetched
  }

  const isLoggedIn = !!userInfo?.username;
  console.log("conditional route ",userInfo);
  
  // Render Endgamee component if logged in, otherwise render LoginPage
  return isLoggedIn ? a : b;
}

function ConditionalRouteTwo({a,b}) {
  const { userInfo, isLoading } = useContext(UserContext);

  if (isLoading) {
      return <div>Loading...</div>; // Render loading indicator if data is still being fetched
  }

  const isLoggedIn = !!userInfo?.username;
  console.log("conditional route ",userInfo);
  const uid = userInfo?.id;
  // Render Endgamee component if logged in, otherwise render LoginPage
  return isLoggedIn ? <Endgamee uid={uid} /> : <LoginPage />
}


export default App;
