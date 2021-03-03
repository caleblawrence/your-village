import prisma from "../../lib/prisma";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  let myRequestedTimes = await prisma.opportunity.findMany({
    where: {
      requestedByUserId: userId,
    },
    include: {
      babySitter: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  res.status(200).json({ requestedTimes: myRequestedTimes });
});
