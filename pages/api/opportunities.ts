import prisma from "../../lib/prisma";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  let myRequestedTimes = await prisma.opportunity.findMany({
    where: {
      requestedByUserId: userId,
    },
    include: {
      babySitter: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  let rawFriendData = await prisma.userFriend.findMany({
    where: { userId: userId },
    select: {
      friend: {
        select: {
          id: true,
        },
      },
    },
  });

  let friendIds = rawFriendData.map((row) => row.friend.id);
  // TODO: only get future opportunites here
  let opportunities = await prisma.opportunity.findMany({
    include: {
      requestedByUser: true,
      babySitter: true,
    },
    where: {
      NOT: {
        requestedByUserId: userId,
      },
      requestedByUserId: { in: friendIds },
    },
    orderBy: {
      babysitterId: "desc",
    },
  });
  res
    .status(200)
    .json({ requestedTimes: myRequestedTimes, opportunities: opportunities });
});
