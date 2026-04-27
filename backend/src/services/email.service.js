import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(toEmail, token) {
  const verifyUrl = `${APP_URL}/verify/${token}`;
  await transporter.sendMail({
    from: `"Urban Guess" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Verify your Urban Guess account",
    html: `
      <h2>Welcome to Urban Guess!</h2>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(toEmail, token) {
  const resetUrl = `${APP_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: `"Urban Guess" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Reset Urban Guess password",
    html: `
      <h2>Urban Guess</h2>
      <p>Click the link below to reset your account password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
