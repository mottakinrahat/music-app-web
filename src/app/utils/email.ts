import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import config from "../config";

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.smtpUserName,
    pass: config.smtpPassword,
  },
});

interface EmailData {
  email: string;
  subject: string;
  html: string;
}

const emailWithNodeMail = async (emailData: EmailData): Promise<void> => {
  try {
    const mailOptions: SendMailOptions = {
      from: config.smtpUserName,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export { emailWithNodeMail };
