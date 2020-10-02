import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORT,
  },
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
    html, // html body
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
        ),
      },
    ],
    html, // html body
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
        ),
      },
    ],
    html, // html body
  });
};
