import React, { useEffect } from "react";
import Head from "next/head";
import useUser from "../lib/useUser";
import { IUser } from "../types/IUser";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import PeopleIcon from "@material-ui/icons/People";
import fetcher from "../lib/fetcher";
import useSWR from "swr";
import { useRouter } from "next/router";
import fetchJson from "../lib/fetchJson";
import { AppBar, Button, makeStyles } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MoreIcon from "@material-ui/icons/MoreVert";
import { fade, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

const Layout = ({ children }) => {
  const router = useRouter();
  const [value, setValue] = React.useState("home");
  let userData = useUser({ redirectTo: "" });
  let user: IUser = userData.user;
  let mutateUser = userData.mutateUser;

  const classes = useStyles();

  const { data } = useSWR("/api/notifications", fetcher, {
    focusThrottleInterval: 10000,
    dedupingInterval: 10000,
  });
  let numUnreadNotifications = 0;
  if (data && data.notifications) {
    numUnreadNotifications = data.notifications.filter(
      (notification) => notification.read === false
    ).length;
  }

  useEffect(() => {
    if (router.pathname === "/home") {
      setValue("home");
    } else if (router.pathname === "/friends") {
      setValue("friends");
    } else if (router.pathname === "/notifications") {
      setValue("notifications");
    } else if (router.pathname === "/settings") {
      setValue("settings");
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Head>
        <title>Your Village</title>
      </Head>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, Noto Sans, sans-serif, "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        .container {
          max-width: 55rem;
          margin: 1.5rem auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .MuiOutlinedInput-notchedOutline {
          border-color: rgb(255 255 255 / 34%) !important;
        }

        .bottomNav {
          display: none !important;
          position: fixed;
          bottom: 0;
          width: 100%;
        }

        @media (max-width: 480px) {
          .bottomNav {
            display: block !important;
          }
          .desktopNav {
            display: none !important;
          }
        }

        @media only screen and (min-width: 768px) {
        }
      `}</style>

      <main>
        <div className="desktopNav grow">
          <AppBar position="static" style={{ backgroundColor: "#69779b" }}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}></Typography>
              {!user?.isLoggedIn && (
                <>
                  <Button href="/login" style={{ color: "#f0ece2" }}>
                    Login
                  </Button>
                  <Button style={{ color: "#f0ece2" }} href="/signup">
                    Signup
                  </Button>
                </>
              )}
              {user?.isLoggedIn && (
                <>
                  <Button style={{ color: "#f0ece2" }} href="/home">
                    Home
                  </Button>
                  <Button style={{ color: "#f0ece2" }} href="/friends">
                    Friends
                  </Button>
                  <IconButton
                    style={{ color: "#f0ece2" }}
                    href="/notifications"
                  >
                    <Badge
                      badgeContent={
                        numUnreadNotifications !== undefined &&
                        numUnreadNotifications.toString()
                      }
                      color="primary"
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <div>
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      style={{ color: "#f0ece2" }}
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={async (e) => {
                          router.push("/settings");
                        }}
                      >
                        Settings
                      </MenuItem>
                      <MenuItem
                        onClick={async (e) => {
                          e.preventDefault();
                          await mutateUser(fetchJson("/api/logout"));
                          setTimeout(function () {
                            router.push("/login");
                          }, 2000);
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </>
              )}
            </Toolbar>
          </AppBar>
        </div>

        <div className="container">{children}</div>
        <div className="bottomNav">
          <BottomNavigation
            style={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="Home"
              value="home"
              href="/home"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              label="Friends"
              value="friends"
              href="/friends"
              icon={<PeopleIcon />}
            />
            <BottomNavigationAction
              label="Notifications"
              value="notifications"
              href="/notifications"
              icon={
                <IconButton
                  style={{
                    color: "#f0ece2",
                    marginBottom: 0,
                    paddingBottom: 0,
                  }}
                >
                  <Badge
                    badgeContent={
                      numUnreadNotifications !== undefined &&
                      numUnreadNotifications.toString()
                    }
                    color="primary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              }
            />
            <BottomNavigationAction
              label="Settings"
              value="settings"
              href="/settings"
              icon={<SettingsIcon />}
            />
          </BottomNavigation>
        </div>
      </main>
    </>
  );
};

export default Layout;
