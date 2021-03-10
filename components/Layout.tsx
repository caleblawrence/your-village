import React, { useEffect } from "react";
import Head from "next/head";
import Header from "./Header";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import { useRouter } from "next/router";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PeopleIcon from "@material-ui/icons/People";
import { Badge, IconButton } from "@material-ui/core";

const Layout = ({ children }) => {
  const router = useRouter();
  const [value, setValue] = React.useState("home");
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
      <Header />

      <main>
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
                  aria-label="show 17 new notifications"
                  style={{
                    color: "#f0ece2",
                    marginBottom: 0,
                    paddingBottom: 0,
                  }}
                >
                  <Badge badgeContent={17} color="primary">
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
