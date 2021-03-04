import prisma from "../../lib/prisma";
import assert from "assert";
import bcrypt from "bcryptjs";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
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
    req.session.set("user", {
      id: user.id,
      name: user.name,
      email: user.email,
      isLoggedIn: true,
    });

    await req.session.save();
    return res.status(200).json({ message: "Logged in" });
  }

  return res.status(401).json({ error: true, message: "Auth Failed" });
});
