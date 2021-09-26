import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  req.session.user = null;
  await req.session.save();

  req.session.destroy();
  res.setHeader("cache-control", "no-store, max-age=0");
  return res.status(200).json({ message: "Logged out" });
});
