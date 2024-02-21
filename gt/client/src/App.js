import logo from './logo.svg';
import './App.css';
import IndexPage from './components/IndexPage';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './components/SignUpPage.js';
import LoginPage from './components/LoginPage';
import CategoryPage from './components/CategoryPage.js';
import Endgame from './components/Endgame.js';
import {UserContextProvider} from './UserContext.js'
function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#009688'
      },
      secondary: {
        main: '#FFDB58'
      }
    },
  })
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      
        <Router>
        <UserContextProvider>
            <Routes>
              <Route path='/' element={<IndexPage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/category' element={<CategoryPage />} />
              <Route path='/end' element={<Endgame />} />
            </Routes>
            </UserContextProvider>
        </Router>
        
      </ThemeProvider>
    </div>
  );
}

export default App;
