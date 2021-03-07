import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import React from "react";
import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import fetchJson from "../lib/fetchJson";

const Settings = () => {
  const router = useRouter();
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  let mutateUser = data.mutateUser;

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <h1 style={{ margin: 0, padding: 0, marginBottom: 20 }}>Notifications</h1>
    </Layout>
  );
};

export default Settings;
