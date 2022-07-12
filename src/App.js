// import "./App.css";
import {  useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import PugRoutes from "./routes/PugRoutes";
import PugApi from "./api/api";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./api/secretKey";
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialMy } from "./store/my/mySlice";
import { fetchGames } from "./store/games/gamesSlice";
import { fetchUsers } from "./store/users/usersSlice";
import BottomNavigationBar from "./navigation/BottomNavigationBar";
import { Stack, Box } from "@mui/material";
import TopAppBar from "./navigation/TopAppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "pug-token";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
  },
});

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const myStatus = useSelector((state) => state.my.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      try {
        let { username } = jwt.verify(token, SECRET_KEY);
        PugApi.token = token;
        if (myStatus === "idle") {
          dispatch(fetchGames());
          dispatch(fetchUsers());
          dispatch(fetchInitialMy(username));
        }
      } catch (err) {
        console.error("App useEffect dispatch error");
      }
    }
  }, [dispatch, myStatus, token]);

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


  return (
    <ThemeProvider theme={theme}>
      <Stack className="App">
        <TopAppBar />
        <Box sx={{ marginTop: 5, marginBottom: 9, width: "100%" }}>
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
