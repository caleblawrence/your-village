import withSession from "../../lib/session";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import assert from "assert";

const { JWT_SECRET } = process.env;
const saltRounds = 10;

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") return;

    try {
      assert.notEqual(null, req.body.email, "Email required");
      assert.notEqual(null, req.body.password, "Password required");
    } catch (bodyError) {
      res.status(400).json({ error: true, message: bodyError.message });
    }
    const { name, email, password } = await req.body;

    const usersWithEmail = await prisma.user.count({
      where: {
        email: email,
      },
    });

    if (usersWithEmail > 0) {
      res.status(400).json({ error: true, message: "Email already exists." });
    }

    try {
      bcrypt.hash(password, saltRounds, async function (err, hash: string) {
        const user = await prisma.user.create({
          data: {
            email,
            name,
            password: hash,
          },
        });

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          {
            expiresIn: 3000, //50 minutes
          }
        );
        res.status(200).json({ token });
        return;
      });
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json(error.data);
      return;
    }
  }
);
