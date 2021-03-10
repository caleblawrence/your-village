import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
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
        return <p>{notification.message}</p>;
      })}
    </Layout>
  );
};

export default Notifications;
