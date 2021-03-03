import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  const user = req.session.get("user");
  console.log("user", user);
  if (user !== undefined) {
    return res.send(user);
  }
  return res.send({ isLoggedIn: false });
});
