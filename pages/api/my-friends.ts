import assert from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    assert.notEqual(null, req.query.userId, "userId required");
  } catch (bodyError) {
    return res.status(400).json({ error: true, message: bodyError.message });
  }

  const userId = req.query.userId as string;

  let rawFriendData = await prisma.userFriend.findMany({
    where: { userId: +userId },
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
  res.status(200).json(friends);
};
