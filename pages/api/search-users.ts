import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import * as yup from "yup";

let requestSchema = yup.object().shape({
  name: yup.string().required(),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await requestSchema.validate(req.query);
  } catch (err) {
    return res.status(400).json({ error: true, errors: err.errors });
  }

  const name = req.query.name as string;

  let matchedUsers = await prisma.user.findMany({
    where: { name: { contains: name.trim(), mode: "insensitive" } },
  });
  res.status(200).json({ users: matchedUsers });
};
