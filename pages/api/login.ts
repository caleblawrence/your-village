import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import withSession from "../../lib/session";
import * as yup from "yup";

let requestSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export default withSession(async (req, res, session) => {
  if (typeof req.body !== "object") {
    return res
      .status(400)
      .json({ error: true, errors: ["request body is required"] });
  }

  try {
    await requestSchema.validate(req.body);
  } catch (err) {
    return res.status(400).json({ error: true, errors: err.errors });
  }

  const { email, password } = await req.body;

  let user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user == null) {
    return res
      .status(404)
      .json({ error: true, errors: ["User not found for this email address"] });
  }

  var match = await bcrypt.compare(password, user.password);

  if (match) {
    req.session.set("user", {
      id: user.id,
      name: user.name,
      email: user.email,
      isLoggedIn: true,
    });

    await req.session.save();
    return res.status(200).json({ message: "Logged in" });
  }

  return res.status(401).json({ error: true, errors: ["Incorrect password"] });
});
