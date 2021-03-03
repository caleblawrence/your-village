import assert from "assert";
import prisma from "../../lib/prisma";
import withSession from "../../lib/session";

export default withSession(async (req, res, session) => {
  try {
    assert.notEqual(null, req.body.date, "date required");
    assert.notEqual(null, req.body.hours, "hours required");
  } catch (bodyError) {
    return res.status(400).json({ error: true, message: bodyError.message });
  }

  if (isNaN(req.body.hours)) {
    return res
      .status(400)
      .json({ error: true, message: "hours must be an integer" });
  }
  if (!Date.parse(req.body.date)) {
    return res
      .status(400)
      .json({ error: true, message: "date must be a valid date" });
  }
  const { date, hours } = req.body;

  if (req.session.get("user") === undefined) {
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  try {
    let newOpportunity = await prisma.opportunity.create({
      data: {
        date: new Date(req.body.date),
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
