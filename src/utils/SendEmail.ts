import nodemailer from "nodemailer";
import { config } from "../config";
import ApiError from "./ApiError";

if (!config.user_email || !config.user_password) {
	throw new ApiError(400 ,"Email credentials not configured properly");
}

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: config.node_env === "production" ? 465 : 587,
	secure: config.node_env === "production",
	auth: {
		user: config.user_email,
		pass: config.user_password,
	},
});

export const sendEmail = async (
	to: string,
	subject: string,
	html: string
): Promise<{
	response: string;
}> => {
	const mailOptions = {
		from: config.user_email,
		to,
		subject,
		html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		return info;
	} catch {
		throw new ApiError(500, "Failed to send email");
	}
};
