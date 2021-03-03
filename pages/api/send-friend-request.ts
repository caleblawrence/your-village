import assert from "assert";
import prisma from "../../lib/prisma";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  try {
    assert.notEqual(null, req.body.requestedUserId, "requestedUserId required");
  } catch (bodyError) {
    return res.status(400).json({ error: true, message: bodyError.message });
  }

  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  const { requestedUserId } = req.body;

  if (userId === requestedUserId) {
    return res
      .status(400)
      .json({ error: true, message: "Cannot add yourself as a friend" });
  }

  await prisma.userFriendRequests.create({
    data: {
      requestedUserId: +requestedUserId,
      sentByUserId: +userId,
    },
  });
  // TODO: send email telling the user they got a friend request

  res.status(200).json({ succes: true });
});
