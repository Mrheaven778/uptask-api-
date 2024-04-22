import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const config = () => {
  return{
    
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }
}

export const transport = nodemailer.createTransport(config());
