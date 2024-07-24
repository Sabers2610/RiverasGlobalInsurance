import nodemailer from 'nodemailer'
import CustomError from './exception.util.js';
import config from '../config/config.js'


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: config.user_gmail,
        pass: config.gmail_key,
    },
});

export async function sendEmail(to, subject, text, html=null) {
    try {
        const readyTransport = await transporter.verify()

        if(readyTransport) {
            console.log("Sending email...")
        }

        const INFO = transporter.sendMail({
            from: `Rivera's Global Insurance <globalinsurance@gmail.com>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
        });

        return INFO
    } catch(error) {
        throw new CustomError(error, 500, "API_SENDEMAIL_ERROR")
    }

}