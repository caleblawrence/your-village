import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import SearchUsers from "../components/SearchUsers";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { Paper, Button } from "@material-ui/core";
import axios from "axios";

const Friends = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  const [friendToAdd, setFriendToAdd] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [myFriends, setMyFriends] = useState<IUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<IUser[]>([]);

  useEffect(() => {
    if (user == null) return;
    async function getMyFriends() {
      const myFriendsResponse = await axios.get(
        `/api/my-friends?userId=${user.id}`
      );
      setMyFriends(myFriendsResponse.data.friends);
      setFriendRequests(myFriendsResponse.data.friendRequests);
    }
    getMyFriends();
  }, [user]);

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
      <h1 style={{ margin: 0, padding: 0 }}>Your Friends</h1>
      <p style={{ margin: 0, padding: 0, color: "#7f7d7d" }}>
        {myFriends.length} {myFriends.length > 1 ? "Friends" : "Friend"}
      </p>
      {myFriends.map((friend) => {
        return (
          <div>
            <p
              style={{
                margin: 0,
                padding: 0,
                marginTop: 10,
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {friend.name}
            </p>
            <p style={{ margin: 0, padding: 0 }}>{friend.email}</p>
          </div>
        );
      })}
      <h1 style={{ margin: 0, padding: 0, marginTop: 30 }}>Friend Requests</h1>

      {friendRequests.map((friendRequest) => {
        return (
          <div>
            <div style={{ display: "inline-block" }}>
              <p
                style={{
                  margin: 0,
                  padding: 0,
                  marginTop: 10,
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {friendRequest.name}
              </p>
              <p style={{ margin: 0, padding: 0 }}>{friendRequest.email}</p>
            </div>

            <Button
              variant="outlined"
              color="primary"
              size="small"
              style={{ marginRight: 15, marginBottom: 18, marginLeft: 10 }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              size="small"
              style={{ marginRight: 15, marginBottom: 18 }}
            >
              Decline
            </Button>
          </div>
        );
      })}
      <h1 style={{ margin: 0, padding: 0, marginTop: 30 }}>Add Friends</h1>
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

export default Friends;
