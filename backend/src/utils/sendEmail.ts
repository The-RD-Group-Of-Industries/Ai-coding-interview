import nodemailer from "nodemailer";

export const sendSignupEmail = async (
  toEmail: string,
  name: string,
  otp: number
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"The-RD-Group-Of-Industries" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to our Platform",
    html: `<p>Hello <b>${name}</b>,</p>
    <p>Here is your OTP: ${otp}. Don't share with anyone.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendSelectionEmail = async (
  toEmail: string,
  name: string,
  jobRole: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"The-RD-Group-Of-Industries" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to The RD Group Of Industries",
    html: `<p>To, <b>${name}</b>,</p>
    <p>Greetings!</p>
    <p>On behalf of The RD Group Of Industries, I am pleased to extend an internship opportunity to you for the role of <b>${jobRole}</b>.
    Your interest and potential have been noted, and we are excited to have you join our team.
    </p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendRejectionEmail = async (
  toEmail: string,
  name: string,
  jobRole: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"The-RD-Group-Of-Industries" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Regarding Your Application for Internship",
    html: `<p>To, <b>${name}</b>,</p>
    <p>Greetings!</p>
    <p>We appreciate your interest in the internship position of <b>${jobRole}</b> at The RD Group Of Industries.</p>
    <p>After careful consideration, we regret to inform you that you have not been selected for this opportunity.</p>
    <p>We wish you all the best in your future endeavors.</p>
    <p>Thank you for your time and effort.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
