import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetMy, setTab } from "../store/my/mySlice";

const TopAppBar = ({ logout }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const myUsername = useSelector((state) => state.my.username);
  const myProfileImg = useSelector((state) => state.my.user?.profileImg);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const settings = [
    {
      title: "Account",
      onClick: () => {
        handleCloseUserMenu();
        dispatch(setTab(4));
        if (location.pathname !== "/") {
          navigate("/");
        }
      },
    },
    {
      title: "Profile",
      onClick: () => {
        handleCloseUserMenu();
        navigate(`/users/u/${myUsername}`);
      },
    },
    {
      title: "Logout",

      onClick: () => {
        handleCloseUserMenu();
        dispatch(resetMy());
        logout();
        navigate(`/`);
      },
    },
  ];

  const memberPages = [
    {
      title: "Start PUG",
      onClick: () => {
        handleCloseNavMenu();
        navigate("/games/new");
      },
    },
    {
      title: "Find Court",
      onClick: () => {
        handleCloseNavMenu();
        navigate("/courts");
      },
    },
  ];

  const publicPages = [
    {
      title: "Login",
      onClick: () => {
        handleCloseNavMenu();
        navigate("/login");
      },
    },
    {
      title: "Signup",
      onClick: () => {
        handleCloseNavMenu();
        navigate("/signup");
      },
    },
  ];

  return (
    <AppBar
      sx={{ position: "fixed", top: 0, backgroundColor: "#B1A7A6", height: 60 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsBasketballIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            PUG
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {myUsername
                ? memberPages.map((page) => (
                    <MenuItem key={page.title} onClick={() => page.onClick()}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  ))
                : publicPages.map((page) => (
                    <MenuItem key={page.title} onClick={() => page.onClick()}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <SportsBasketballIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            PUG
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {myUsername
              ? memberPages.map((page) => (
                  <Button
                    key={page.title}
                    onClick={() => page.onClick()}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.title}
                  </Button>
                ))
              : publicPages.map((page) => (
                  <Button
                    key={page.title}
                    onClick={() => page.onClick()}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.title}
                  </Button>
                ))}
          </Box>
          {myUsername && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Remy Sharp"
                    src={myProfileImg}
                    sx={{ backgroundColor: "#FFFFFF" }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.title}
                    onClick={() => setting.onClick()}
                  >
                    <Typography textAlign="center">{setting.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default TopAppBar;
