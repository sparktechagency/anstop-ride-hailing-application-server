import nodemailer from "nodemailer";
import { config } from "../../config";
import ApiError from "../ApiError";

// if (!config.user_email || !config.user_password) {
// 	throw new ApiError(400, "Email credentials not configured properly");
// }

// const transporter = nodemailer.createTransport({
// 	host: "smtp.gmail.com",
// 	port: config.node_env === "production" ? 465 : 587,
// 	secure: config.node_env === "production",
// 	auth: {
// 		user: config.user_email,
// 		pass: config.user_password,
// 	},
// });

// Looking to send emails in production? Check out our Email API/SMTP product!
// var transporter = nodemailer.createTransport({
// 	host: "sandbox.smtp.mailtrap.io",
// 	port: 2525,
// 	auth: {
// 		user: "adad51abad81c7",
// 		pass: "89245c118afc28",
// 	},
// });

var transporter = nodemailer.createTransport({
	// host: "sandbox.smtp.mailtrap.io",
	// port: 2525,
	// auth: {
	// 	user: "adad51abad81c7",
	// 	pass: "89245c118afc28",
	// },
	host: config.USER.smtp_host,
	port: config.USER.smtp_port,
	secure: true,
	auth: {
		user: config.USER.smtp_email,
		pass: config.USER.smtp_password,
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
		from: "Photo Management App <" + config.USER.smtp_email + ">",
		to,
		subject,
		html: html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		return info;
	} catch {
		throw new ApiError(500, "Failed to send email");
	}
};
