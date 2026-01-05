import { buildTransporter } from "@/src/lib/buildTransporter";
import { Email, EmailQueue } from "./email.model";
import { Transporter } from "nodemailer";

export class EmailService {
  async sendEmail(shopId: number, data: Email) {
    const transporter = await buildTransporter(shopId);
    if (!transporter) return;
    await this._sendMail(data, transporter);
  }

  private async _sendMail(payload: Email, transporter: Transporter) {
    const { to, subject, html, attachments } = payload;

    await transporter.sendMail({
      from: `"Payroll System" <${process.env.SMTP_FROM}>`,
      // to: Array.isArray(to) ? to.join(",") : to,
      to:"tunwit2458@gmail.com",
      subject,
      html,
      attachments,
    });
  }
}
