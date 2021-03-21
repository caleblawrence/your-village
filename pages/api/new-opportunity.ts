import prisma from "../../lib/prisma";
import withSession from "../../lib/session";
import * as yup from "yup";
import { sendEmail, Email } from "../../lib/email";
import { format } from "date-fns";

let requestSchema = yup.object().shape({
  date: yup.date().required(),
  notes: yup.string(),
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

  const { date, notes } = req.body;

  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  try {
    let newOpportunity = await prisma.opportunity.create({
      data: {
        date: new Date(date),
        notes: notes,
        requestedByUserId: userId,
      },
    });

    let rawFriendsData = await prisma.userFriend.findMany({
      where: { userId: userId },
      select: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    let userFriends = rawFriendsData.map((row) => row.friend);
    userFriends.forEach(async (friend) => {
      const msg: Email = {
        to:
          process.env.NODE_ENV === "production"
            ? friend.email
            : "lawrence.calebc@gmail.com",
        from: "lawrence.calebc@gmail.com",
        subject: `${req.session.get("user").name} added a date for ${format(
          new Date(date),
          "LLL do, yyyy h:mmaaa"
        )}`,
        html:
          process.env.NODE_ENV === "production"
            ? "Click <a href='https://your-village.vercel.app/home'>here</a> to sign up"
            : "Click <a href='https://localhost:3000/home'>here</a> to sign up",
      };
      await sendEmail(msg);

      await prisma.notification.create({
        data: {
          message: "You have a new opportunity",
          link: "/home",
          userId: +friend.id,
        },
      });
    });
    return res.send(newOpportunity);
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: true, message: "opportunity already exists" });
    }
    return res
      .status(500)
      .json({ error: true, message: "internal server error" });
  }
});
