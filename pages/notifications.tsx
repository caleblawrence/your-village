import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import React from "react";
import { Button } from "@material-ui/core";

const Settings = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  let mutateUser = data.mutateUser;

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <h1 style={{ margin: 0, padding: 0, marginBottom: 20 }}>Notifications</h1>
      <p>
        Notifications is a work in progress. Go to the frinds page to view new
        friends and go to the home page to view new opportunites.
      </p>
    </Layout>
  );
};

export default Settings;
