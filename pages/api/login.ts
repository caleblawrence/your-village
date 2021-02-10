import withSession from "../../lib/session";
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import assert from "assert";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export default withSession(async (req: any, res: NextApiResponse) => {
  try {
    assert.notEqual(null, req.body.email, "Email required");
    assert.notEqual(null, req.body.password, "Password required");
  } catch (bodyError) {
    return res.status(400).json({ error: true, message: bodyError.message });
  }

  const { email, password } = await req.body;

  let user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user == null) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  var match = await bcrypt.compare(password, user.password);

  if (match) {
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: 3000, //50 minutes
    });
    // this removes the password hash from the object so that it's not sent to the client
    delete user.password;
    req.session.set("user", user);
    await req.session.save();
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: true, message: "Auth Failed" });
});
