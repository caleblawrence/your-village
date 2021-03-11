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
import {
  AppBar,
  IconButton,
  Typography,
  Button,
  Badge,
  makeStyles,
  Toolbar,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Layout = ({ children }) => {
  const router = useRouter();
  const [value, setValue] = React.useState("home");
  let userData = useUser({ redirectTo: "/login" });
  let user: IUser = userData.user;
  let mutateUser = userData.mutateUser;

  const classes = useStyles();

  const { data } = useSWR("/api/notifications", fetcher, {
    focusThrottleInterval: 10000,
    dedupingInterval: 10000,
  });
  let numUnreadNotifications = undefined;
  if (data) {
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

  return (
    <>
      <Head>
        <title>Babysitter App</title>
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
          max-width: 65rem;
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
        <div className="desktopNav">
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
                  <Button
                    style={{ color: "#f0ece2" }}
                    href="/api/logout"
                    onClick={async (e) => {
                      e.preventDefault();
                      await mutateUser(fetchJson("/api/logout"));
                      router.push("/login");
                    }}
                  >
                    Logout
                  </Button>
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
