import assert from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return;
  try {
    assert.notEqual(null, req.query.name, "Name required");
  } catch (bodyError) {
    return res.status(400).json({ error: true, message: bodyError.message });
  }

  const name = req.query.name as string;

  let matchedUsers = await prisma.user.findMany({
    where: { name: { contains: name.trim(), mode: "insensitive" } },
  });
  res.status(200).json({ users: matchedUsers });
};
