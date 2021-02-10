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
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

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
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          BabySitting App
        </Typography>
        {!user?.isLoggedIn && (
          <Button color="inherit" href="/login">
            Login
          </Button>
        )}
        {user?.isLoggedIn && (
          <>
            <Button color="inherit" href="/profile">
              Profile
            </Button>
            <Button
              color="inherit"
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
  );
};

export default Header;
