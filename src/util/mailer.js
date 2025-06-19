const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.fovizo.com", // Örn: smtp.gmail.com
  port: 587,
  secure: false,
  auth: {
    user: "info@fovizo.com",
    pass: "oncel19881991"
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