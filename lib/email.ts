import sgMail from "@sendgrid/mail";

export interface Email {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export const sendEmail = async (email: Email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    await sgMail.send(email);
  } catch (error) {
    console.log("error sending email: ", error);
  }
};
