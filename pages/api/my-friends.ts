import prisma from "../../lib/prisma";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  let rawFriendData = await prisma.userFriend.findMany({
    where: { userId: userId },
    select: {
      friend: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  let friends = rawFriendData.map((row) => row.friend);

  let rawFriendRequestData = await prisma.userFriendRequests.findMany({
    where: {
      requestedUserId: +userId,
    },
    select: {
      sentByUser: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  let friendRequests = rawFriendRequestData.map((row) => row.sentByUser);
  res.status(200).json({ friends: friends, friendRequests: friendRequests });
});
