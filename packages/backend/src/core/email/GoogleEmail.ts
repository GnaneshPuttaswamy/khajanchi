import EmailInterface from './EmailInterface.js';
import nodemailer from 'nodemailer';

class GoogleEmail implements EmailInterface {
  private transporter: any;

  constructor(config: { user: string; appPassword: string }) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.appPassword,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string, html?: string): Promise<any> {
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to,
      subject,
      text: body,
      html: html || undefined,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

export default GoogleEmail;
