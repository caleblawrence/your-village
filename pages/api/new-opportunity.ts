import prisma from "../../lib/prisma";
import withSession from "../../lib/session";
import * as yup from "yup";

let requestSchema = yup.object().shape({
  date: yup.date().required(),
  hours: yup.number().positive().required(),
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

  const { date, hours } = req.body;

  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  try {
    let newOpportunity = await prisma.opportunity.create({
      data: {
        date: new Date(date),
        hours: +hours,
        requestedByUserId: userId,
      },
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
