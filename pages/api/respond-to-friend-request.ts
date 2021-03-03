import assert from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  try {
    assert.notEqual(null, req.body.friendId, "friendId required");
    assert.notEqual(null, req.body.accepted, "accepted required");
  } catch (bodyError) {
    return res.status(400).json({ error: true, message: bodyError.message });
  }
  const { friendId, accepted } = req.body;

  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  const friendRequest = await prisma.userFriendRequests.findFirst({
    where: {
      sentByUserId: +friendId,
      requestedUserId: +userId,
    },
  });

  if (friendRequest === null) {
    res
      .status(500)
      .json({ error: true, message: "Friend request does not exist." });
  }

  // TODO: how in the world do you cast to bool here????
  if (accepted == "true" || accepted == true) {
    await prisma.userFriend.create({
      data: {
        userId: +userId,
        friendId: +friendId,
      },
    });

    await prisma.userFriend.create({
      data: {
        userId: +friendId,
        friendId: +userId,
      },
    });

    await prisma.userFriendRequests.delete({
      where: {
        id: friendRequest.id,
      },
    });
  } else {
    await prisma.userFriendRequests.delete({
      where: {
        id: friendRequest.id,
      },
    });
  }

  res.status(200).json({ succes: true });
});
