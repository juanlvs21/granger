import nodemailer from "nodemailer";
import path from "path";

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

export const emailSignup = async (
  to: string,
  subject: string,
  html: string
) => {
  await transporter.sendMail({
    from: '"Granger 📖" <books@granger.com.ve>', // sender address
    to, // list of receivers
    subject, // Subject line
    html // html body
  });
};

export const emailSendBook = async (
  to: string,
  subject: string,
  html: string,
  book: any
) => {
  await transporter.sendMail({
    from: '"Granger 📖" <books@granger.com.ve>', // sender address
    to, // list of receivers
    subject, // Subject line
    attachments: [
      {
        filename: `${book.title}.pdf`,
        path: path.resolve(
          __dirname,
          "../../",
          `uploads/pdf/${book.uuid}/${book.pdf}`
        )
      }
    ],
    html // html body
  });
};

export const emailDeleteBook = async (
  to: [string],
  subject: string,
  html: string,
  book: any
) => {
  await transporter.sendMail({
    from: '"Granger 📖" <books@granger.com.ve>', // sender address
    to, // list of receivers
    subject, // Subject line
    attachments: [
      {
        filename: `${book.title}.pdf`,
        path: path.resolve(
          __dirname,
          "../../",
          `uploads/pdf/${book.uuid}/${book.pdf}`
        )
      }
    ],
    html // html body
  });
};
