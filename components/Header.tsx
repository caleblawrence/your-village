import React from "react";
import Link from "next/link";
import useUser from "../lib/useUser";
import { useRouter } from "next/router";
import fetchJson from "../lib/fetchJson";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
  Badge,
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

const Header = () => {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const classes = useStyles();

  return (
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
                aria-label="show 17 new notifications"
                style={{ color: "#f0ece2" }}
              >
                <Badge badgeContent={17} color="primary">
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
  );
};

export default Header;
