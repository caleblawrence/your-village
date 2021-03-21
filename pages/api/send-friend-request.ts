import prisma from "../../lib/prisma";
import withSession from "../../lib/session";
import * as yup from "yup";
import { sendEmail, Email } from "../../lib/email";

let requestSchema = yup.object().shape({
  requestedUserId: yup.number().required(),
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

  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, errors: ["restricted"] });
  }

  let userId = req.session.get("user").id;

  const { requestedUserId } = req.body;

  if (userId === requestedUserId) {
    return res
      .status(400)
      .json({ error: true, erros: ["Cannot add yourself as a friend"] });
  }

  await prisma.userFriendRequests.create({
    data: {
      requestedUserId: +requestedUserId,
      sentByUserId: +userId,
    },
  });

  var friend = await prisma.user.findFirst({
    where: {
      id: +requestedUserId,
    },
  });

  const msg: Email = {
    to:
      process.env.NODE_ENV === "production"
        ? friend.email
        : "lawrence.calebc@gmail.com",
    from: "lawrence.calebc@gmail.com",
    subject: "You have recieved a new friend request",
    html:
      process.env.NODE_ENV === "production"
        ? "Click <a href='https://your-village.vercel.app/friends'>here</a> to response"
        : "Click <a href='http://localhost:3000/friends'>here</a> to respond",
  };
  await sendEmail(msg);

  await prisma.notification.create({
    data: {
      message: "You have recieved a new friend request",
      link: "/friends",
      userId: +requestedUserId,
    },
  });

  res.status(200).json({ succes: true });
});
