import nodemailer from "nodemailer";

const sendEmail = async (to: string, subject: string, html: string) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "cybertyxtech@gmail.com",
      pass: "tyx1q2w3e4r()"
    }
  });

  await transporter.sendMail({
    from: '"Granger 📖" <books@granger.com.ve>', // sender address
    to, // list of receivers
    subject, // Subject line
    html // html body
  });
};

export default sendEmail;
