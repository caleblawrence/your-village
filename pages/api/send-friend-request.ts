import assert from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    assert.notEqual(null, req.body.sentByUserId, "sentByUserId required");
    assert.notEqual(null, req.body.requestedUserId, "requestedUserId required");
  } catch (bodyError) {
    return res.status(400).json({ error: true, message: bodyError.message });
  }

  const { sentByUserId, requestedUserId } = req.body;

  await prisma.userFriendRequests.create({
    data: {
      requestedUserId: +requestedUserId,
      sentByUserId: +sentByUserId,
      requestAccepted: false,
    },
  });
  // TODO: send email telling the user they got a friend request

  res.status(200).json({ succes: true });
};
