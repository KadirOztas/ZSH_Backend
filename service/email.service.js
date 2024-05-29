import nodemailer from "nodemailer";
import { Email } from "../model/email.model.js";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_APP_PASSWORD,
	},
});

const sendEmail = async ({ from, to, subject, message }) => {
	try {
		const mailOptions = { from, to, subject, text: message };
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);

		await Email.create({ from, to, subject, message, sentAt: new Date() });
		console.log("Email record created");
	} catch (error) {
		console.error("sendEmail error:", error);
		throw error;
	}
};

export default sendEmail;