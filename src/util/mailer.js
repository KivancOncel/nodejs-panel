const nodemailer = require("nodemailer");

const { MAILUSER, MAILPASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.fovizo.com", // Örn: smtp.gmail.com
  port: 587,
  secure: false,
  auth: {
    user: MAILUSER,
    pass: MAILPASS
  }
});

exports.sendMail = async (to, subject, html) => {
  return transporter.sendMail({
    from: '"Firma Adı" <your@email.com>',
    to,
    subject,
    html
  });
};