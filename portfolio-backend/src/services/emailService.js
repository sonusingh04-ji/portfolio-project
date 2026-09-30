import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

export const sendContactNotification = async ({
                                                  name,
                                                  email,
                                                  subject,
                                                  message
                                              }) => {
    const transporter = createTransporter();

    const receiver =
        process.env.CONTACT_RECEIVER_EMAIL ||
        process.env.SMTP_USER;

    await transporter.sendMail({
        from: `"Portfolio Website" <${process.env.SMTP_USER}>`,
        to: receiver,
        replyTo: email,
        subject: `New Portfolio Contact: ${subject || "New Message"}`,
        text: `
You received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject || "No subject"}

Message:
${message}
        `.trim()
    });
};