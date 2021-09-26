import { TramRounded } from "@material-ui/icons";
import prisma from "../../lib/prisma";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, errors: ["restricted"] });
  }

  let userId = req.session.get("user").id;

  var notifications = await prisma.notification.findMany({
    where: {
      userId: +userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await prisma.notification.updateMany({
    where: {
      userId: +userId,
    },
    data: {
      read: true,
    },
  });

  res.status(200).json({ notifications: notifications });
});
