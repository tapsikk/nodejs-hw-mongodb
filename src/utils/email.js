import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetEmail = async (to, token) => {
  const url = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Password Reset',
    text: `Please reset your password by clicking the link: ${url}`,
    html: `<p>Please reset your password by clicking the link: <a href="${url}">${url}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};
