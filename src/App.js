// import "./App.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import PugRoutes from "./routes/PugRoutes";
import LoadingSpinner from "./common/LoadingSpinner";
import PugApi from "./api/api";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./api/secretKey";
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialMy } from "./store/my/mySlice";
import { fetchGames } from "./store/games/gamesSlice";
import { fetchUsers, resetUserStatus } from "./store/users/usersSlice";
import BottomNavigationBar from "./navigation/BottomNavigationBar";
import {Stack, Box } from '@mui/material'
import TopAppBar from "./navigation/TopAppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "pug-token";

/** Jobly application.
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> Routes
 */

 const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
  },

});


function App() {

  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  const myStatus = useSelector(state => state.my.status)
  const my = useSelector(state => state.my)
  const games = useSelector(state => state.games)
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()



  useEffect(() => {
    if(token){
      try{
        let {username} = jwt.verify(token, SECRET_KEY)
        PugApi.token = token 
        console.log(`app useEffect`, myStatus)
    
        if(myStatus === 'idle'){
          dispatch(fetchInitialMy(username))
          dispatch(fetchGames())
          dispatch(fetchUsers())
          console.log('dispatch app useEffect')
        }
      } catch(err){
        console.error('App useEffect dispatch error')
      }
    }
    
  }, [dispatch, myStatus, token])





  /** Handles site-wide logout. */
  function logout() {
    setToken(null);
  }

  /** Handles site-wide signup.
   *
   * Automatically logs them in (set token) upon signup.
   *
   * Make sure you await this function and check its return value!
   */
  async function signup(signupData) {
    try {
      let token = await PugApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles site-wide login.
   *
   * Make sure you await this function and check its return value!
   */
  async function login(loginData) {
    try {
      console.log(loginData);
      let token = await PugApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }


  console.log(my)


  return (
    <ThemeProvider theme={theme} >

    <Stack className="App">
      <TopAppBar />
      {/* <br></br>
      <Link to="/">Home</Link>
      <br></br>
      <Link to="/users">Users</Link>
      <br></br>
      <Link to="/games">Games</Link> */}
  <Box sx ={{marginTop: 5, marginBottom: 9, width: '100%'}}>
 <PugRoutes login={login} signup={signup} />
  </Box>
  <Box>
<BottomNavigationBar />
  </Box>
     
      
    </Stack>
    </ThemeProvider>
  );
}

export default App;
