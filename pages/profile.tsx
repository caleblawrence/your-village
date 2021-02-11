import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import SearchUsers from "../components/SearchUsers";
import { User } from "@prisma/client";
import { useState } from "react";
import { Paper, Button } from "@material-ui/core";

const SgProfile = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  const [friendToAdd, setFriendToAdd] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleNo = () => {
    setFriendToAdd(null);
    setInputValue("");
  };

  const handleYes = () => {
    // TODO: implement this
    setInputValue("");
  };

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <h1>Your profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <h3>Add friends</h3>
      {friendToAdd && (
        <Paper
          elevation={3}
          style={{ padding: 10, maxWidth: 400, marginBottom: 10 }}
        >
          <h4 style={{ margin: 0, padding: 0 }}>
            Would you like to send a friend request to this user?
          </h4>
          <p style={{ margin: 0, padding: 0, marginTop: 5 }}>
            {friendToAdd.name}
          </p>
          <p style={{ margin: 0, padding: 0, marginTop: 5 }}>
            {friendToAdd.email}
          </p>

          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 15 }}
            onClick={handleYes}
          >
            Yes
          </Button>
          <Button variant="contained" onClick={handleNo}>
            No
          </Button>
        </Paper>
      )}
      <SearchUsers
        setFriendToAdd={setFriendToAdd}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </Layout>
  );
};

export default SgProfile;
