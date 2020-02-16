import nodemailer from "nodemailer";
import path from "path";

export const emailSignup = async (
  to: string,
  subject: string,
  html: string
) => {
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
    attachments: [
      {
        filename: "granger.webp",
        path: path.resolve(__dirname, "../../../", "src/public/granger.png"),
        cid: "logo" //my mistake was putting "cid:logo@cid" here!
      }
    ],
    html // html body
  });
};
