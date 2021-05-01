import withSession from "../../lib/session";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import type { NextApiResponse } from "next";
import * as yup from "yup";

const saltRounds = 10;

let requestSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export default withSession(async (req: any, res: NextApiResponse) => {
  if (typeof req.body !== "object") {
    return res
      .status(400)
      .json({ error: true, errors: ["request body is required"] });
  }

  try {
    await requestSchema.validate(req.body);
  } catch (err) {
    // capitalize first letter of error message
    let errors = err.errors.map(
      (error) => error.charAt(0).toUpperCase() + error.slice(1)
    );

    return res.status(400).json({ error: true, errors: errors });
  }
  const { name, email, password } = await req.body;

  const usersWithEmail = await prisma.user.count({
    where: {
      email: email,
    },
  });

  if (usersWithEmail > 0) {
    res.status(400).json({ error: true, errors: ["Email already exists"] });
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

      req.session.set("user", {
        id: user.id,
        name: user.name,
        email: user.email,
        isLoggedIn: true,
      });

      await req.session.save();
      return res.status(200).json({ message: "Logged in" });
    });
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
    return;
  }
});
