import { Transporter } from "nodemailer";

interface sendMailProps {
  senderAddress?: string;
  email?: string;
  emailName?: string;
  subject?: string;
  html?: string;
  attachments?: any[];
  transporter: Transporter;
}

export async function sendMail({
  email,
  emailName,
  subject,
  html,
  attachments = [],
  senderAddress,
  transporter,
}: sendMailProps) {
  await transporter.sendMail({
    from: `"${emailName}" <${senderAddress}>`, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
    attachments: attachments,
  });
}
