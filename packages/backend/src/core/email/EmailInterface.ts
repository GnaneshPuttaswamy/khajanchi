interface EmailInterface {
  sendEmail(to: string, subject: string, body: string, html?: string): Promise<any>;
}

export default EmailInterface;
