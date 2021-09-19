"use strict";

require("dotenv").config({ path: "src/.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendEmail = async function (context, req) {
  let recipient;
  let subject;
  let text;

  try {
    recipient = req.query.recipient || req.body.recipient;
    subject = req.query.subject || req.body.subject;
    text = req.query.text || req.body.text;

    const msg = {
      to: recipient,
      from: process.env.VERIFIED_SENDER,
      subject: subject,
      text: text,
      html: "<strong>" + text + "</strong>",
    };

    await sgMail
      .send(msg)
      .then((res) => {
        console.log("Sent successfully");
        // context.log.warn("Sent successfully");
        context.res = {
          body: "Email Sent Successfully",
        };
      })
      .catch((error) => {
        context.res = {
          status: 400,
          body: error,
        };
      });
  } catch (error) {
    console.log(error);
    context.log.warn(error);
    context.res = {
      status: 400,
      body: "Invalid request body, please check again",
    };
  }
};
