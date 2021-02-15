import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import SearchUsers from "../components/SearchUsers";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { Paper, Button } from "@material-ui/core";
import axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";

const Friends = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  const [friendToAdd, setFriendToAdd] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [myFriends, setMyFriends] = useState<IUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<IUser[]>([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  async function getMyFriends() {
    setIsLoadingFriends(true);

    // TODO: need leading indicator for this too
    const myFriendsResponse = await axios.get(
      `/api/my-friends?userId=${user.id}`
    );
    setMyFriends(myFriendsResponse.data.friends);
    setFriendRequests(myFriendsResponse.data.friendRequests);
    setIsLoadingFriends(false);
  }

  useEffect(() => {
    if (user == null) return;
    getMyFriends();
  }, [user]);

  const handleNo = () => {
    setFriendToAdd(null);
    setInputValue("");
  };

  const handleYes = async () => {
    setInputValue("");

    await axios.post("/api/send-friend-request", {
      sentByUserId: user.id,
      requestedUserId: friendToAdd.id,
    });

    setFriendToAdd(null);

    // TODO: tell user friend request was sent if success above
  };

  const respondToFriendRequest = async (action: string, friendId: number) => {
    setIsAddingFriend(true);

    await axios.post("/api/respond-to-friend-request", {
      userId: user.id,
      friendId: friendId,
      accepted: action === "accepted" ? true : false,
    });

    if (action === "accepted") {
      getMyFriends();
    }

    setIsAddingFriend(false);
  };

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <h1 style={{ margin: 0, padding: 0 }}>Your Friends</h1>
      {isLoadingFriends && (
        <div style={{ width: 300 }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}

      {!isLoadingFriends && (
        <p style={{ margin: 0, padding: 0, color: "#7f7d7d" }}>
          {myFriends.length} {myFriends.length > 1 ? "Friends" : "Friend"}
        </p>
      )}

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

      {isLoadingFriends && (
        <div style={{ width: 300 }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}

      {!isLoadingFriends && friendRequests.length === 0 && (
        <p style={{ margin: 0, padding: 0, color: "#7f7d7d" }}>
          You have no friend requests.
        </p>
      )}
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

            {isAddingFriend && <p>Loading...</p>}
            {!isAddingFriend && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  style={{ marginRight: 15, marginBottom: 18, marginLeft: 10 }}
                  onClick={(e) =>
                    respondToFriendRequest("accepted", friendRequest.id)
                  }
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  style={{ marginRight: 15, marginBottom: 18 }}
                  onClick={(e) =>
                    respondToFriendRequest("declined", friendRequest.id)
                  }
                >
                  Decline
                </Button>
              </>
            )}
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
