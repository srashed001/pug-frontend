// import "./App.css";
import { useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import PugApi from "./api/api";
import jwt from "jsonwebtoken";
import environment from "./environment";
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialMy } from "./store/my/mySlice";
import { fetchGames } from "./store/games/gamesSlice";
import { fetchUsers } from "./store/users/usersSlice";
import BottomNavigationBar from "./navigation/BottomNavigationBar";
import { Stack, Box } from "@mui/material";
import TopAppBar from "./navigation/TopAppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import "./homepage/publicHomepage.css";
import ErrorFallback from "./errors/ErrorFallback";
import RouteWrapper from "./routes/RouteWrapper";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "pug-token";
const { pugSecretKey } = environment;

const theme = createTheme({
  typography: {
    fontFamily: "Special Elite",
  },
});

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const myStatus = useSelector((state) => state.my.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** Handles site-wide logout. */
  function logout() {
    PugApi.token = null;
    setToken(null);
    navigate("/");
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
      let token = await PugApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  useEffect(() => {
    if (myStatus === "idle") {
      dispatch(fetchGames());
      dispatch(fetchUsers());
      if (token) {
        let { username } = jwt.verify(token, pugSecretKey);
        PugApi.token = token;
        dispatch(fetchInitialMy(username));
      }
    }
  }, [dispatch, myStatus, token]);

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          window.location.reload(true);
        }}
        onError={myErrorHandler}
      >
        <Stack className="App">
          <TopAppBar logout={logout} />
          <Box sx={{ marginTop: 5, marginBottom: 9, width: "100%" }}>
            <RouteWrapper token={token} login={login} signup={signup} />
          </Box>
          <Box>
            <BottomNavigationBar />
          </Box>
        </Stack>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

const myErrorHandler = (error, info) => {
  console.log(error, info);
};

export default App;
