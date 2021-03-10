import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import React, { useEffect, useState } from "react";
import { Button, Divider } from "@material-ui/core";
import axios from "axios";
import { Notification } from "@prisma/client";

const Notifications = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  const [isLoadingNotfications, setIsLoadingNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user == null || user.id == undefined) return;
    refreshNotificatonData();
  }, [user]);

  async function refreshNotificatonData() {
    console.log("here");
    setIsLoadingNotifications(true);
    const notificationsResponse = await axios.get(`/api/notifications`);
    setNotifications(notificationsResponse.data.notifications);
    setIsLoadingNotifications(false);
  }

  return (
    <Layout>
      <h1 style={{ margin: 0, padding: 0, marginBottom: 20 }}>Notifications</h1>
      {notifications.map((notification) => {
        return (
          <>
            <div
              style={{
                marginTop: 10,
                backgroundColor: !notification.read && "#11292d",
                padding: 10,
              }}
            >
              <p style={{ margin: 0, padding: 0 }}>{notification.message}</p>
              <Button color="primary" href={notification.link}>
                View
              </Button>
            </div>
            <Divider style={{ marginTop: 0, width: 320 }} />
          </>
        );
      })}
    </Layout>
  );
};

export default Notifications;
