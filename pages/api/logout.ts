import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  req.session.destroy();
  return res.status(200).json({ message: "Logged out" });
});
