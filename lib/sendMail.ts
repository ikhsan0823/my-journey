/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendMail = (mailOptions: any) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}