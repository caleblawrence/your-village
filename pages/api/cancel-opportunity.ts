import prisma from "../../lib/prisma";
import withSession from "../../lib/session";
import * as yup from "yup";

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
    return res.status(403).json({ error: true, message: "restricted" });
  }

  let userId = req.session.get("user").id;

  let opportunityToDelete = await prisma.opportunity.findFirst({
    where: {
      id: +opportunityId,
    },
  });

  if (opportunityToDelete.requestedByUserId !== userId) {
    return res.status(403).json({
      error: true,
      message: "You cannot delete an date that is not yours",
    });
  }

  const deletedOpportunity = await prisma.opportunity.delete({
    where: { id: opportunityToDelete.id },
  });

  return res.send(deletedOpportunity);
});
