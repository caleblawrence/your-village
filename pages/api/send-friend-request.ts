import prisma from "../../lib/prisma";
import withSession from "../../lib/session";
import * as yup from "yup";

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
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  const { requestedUserId } = req.body;

  if (userId === requestedUserId) {
    return res
      .status(400)
      .json({ error: true, message: "Cannot add yourself as a friend" });
  }

  await prisma.userFriendRequests.create({
    data: {
      requestedUserId: +requestedUserId,
      sentByUserId: +userId,
    },
  });
  // TODO: send email telling the user they got a friend request

  res.status(200).json({ succes: true });
});
