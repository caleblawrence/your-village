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

const Layout = ({ children }) => {
  const router = useRouter();
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    if (router.pathname === "/home") {
      setValue(0);
    } else if (router.pathname === "/friends") {
      setValue(1);
    } else if (router.pathname === "/notifications") {
      setValue(2);
    } else if (router.pathname === "/settings") {
      setValue(3);
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
            showLabels
          >
            <BottomNavigationAction
              label="Home"
              href="/home"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              label="Friends"
              href="/friends"
              icon={<PeopleIcon />}
            />
            <BottomNavigationAction
              label="Notifications"
              href="/notifications"
              icon={<NotificationsIcon />}
            />
            <BottomNavigationAction
              label="Settings"
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
