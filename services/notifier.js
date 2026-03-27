import nodemailer from 'nodemailer';
import twilio from 'twilio';
import 'dotenv/config';

// Email 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// SMS
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendEmail = async (to, subject, body) => {
    return transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text: body });
};

export const sendSMS = async (to, body) => {
    return twilioClient.messages.create({ body, from: process.env.TWILIO_PHONE, to });
};