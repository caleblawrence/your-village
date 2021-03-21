import prisma from "../../lib/prisma";
import withSession from "../../lib/session";
import * as yup from "yup";
import { format } from "date-fns";
import { sendEmail, Email } from "../../lib/email";

let requestSchema = yup.object().shape({
  opportunityId: yup.number().positive().required(),
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

  const { opportunityId } = req.body;

  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, errors: ["restricted"] });
  }

  let userId = req.session.get("user").id;

  let opportunity = await prisma.opportunity.findFirst({
    where: {
      id: +opportunityId,
    },
    include: {
      requestedByUser: true,
    },
  });

  if (opportunity === null) {
    return res.status(404).json({
      error: true,
      errors: ["Opportunity not found"],
    });
  }

  if (opportunity.babysitterId !== null) {
    return res.status(400).json({
      error: true,
      errors: ["This date already has a babysitter"],
    });
  }

  if (opportunity.requestedByUserId === userId) {
    return res.status(400).json({
      error: true,
      errors: ["You can not volunteer for your own date"],
    });
  }

  // TODO: validate that they are even allowed to volunteer for this (have to be a friend)
  const updatedOpportunity = await prisma.opportunity.update({
    where: {
      id: opportunity.id,
    },
    data: {
      babysitterId: userId,
    },
  });

  const msg: Email = {
    to:
      process.env.NODE_ENV === "production"
        ? opportunity.requestedByUser.email
        : "lawrence.calebc@gmail.com",
    from: "lawrence.calebc@gmail.com",
    subject: `${
      req.session.get("user").name
    } has volunteered to babysit for you at ${format(
      new Date(opportunity.date),
      "LLL do, yyyy h:mmaaa"
    )}`,
    html: `${
      req.session.get("user").name
    } has volunteered to babysit for you at ${format(
      new Date(opportunity.date),
      "LLL do, yyyy h:mmaaa"
    )}`,
  };
  await sendEmail(msg);

  await prisma.notification.create({
    data: {
      message: `${
        req.session.get("user").name
      } has volunteered to babysit for you at ${format(
        new Date(opportunity.date),
        "LLL do, yyyy h:mmaaa"
      )}`,
      link: "/home",
      userId: opportunity.requestedByUserId,
    },
  });

  return res.send(updatedOpportunity);
});
