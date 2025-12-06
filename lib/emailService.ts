"use server";
import nodemailer from "nodemailer";

interface sendMailProps {
  senderAddress?: string;
  email?: string;
  emailName?: string;
  subject?: string;
  html?: string;
  attachments?: any[];
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  password?: string;
}

const createTransporter = (
  host: string,
  port: number = 465,
  secure: boolean = true,
  username: string = "",
  password: string = "",
) => {
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: {
      user: username,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export async function verify(
  host: string,
  port: number,
  secure: boolean,
  username: string,
  password: string,
) {
  try {
    console.log(host, port, secure, username, password);

    const transport = await createTransporter(
      host,
      port,
      secure,
      username,
      password,
    );
    await transport.verify();
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function sendMail({
  email,
  emailName,
  subject,
  html,
  attachments = [],
  senderAddress,
  host,
  port,
  secure,
  username,
  password,
}: sendMailProps) {
  const transport = await createTransporter(
    host || "",
    port,
    secure,
    username,
    password,
  );

  await transport.sendMail({
    from: `"${emailName}" <${senderAddress}>`, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
    attachments: attachments,
  });
}
