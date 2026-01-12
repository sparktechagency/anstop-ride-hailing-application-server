import nodemailer from "nodemailer";
import { OTP_TYPE, OTPType } from "../../modules/otpToken/otpToken.constant";
import { EmailTemplates } from "./emailTemplate";
import { config } from "../../config";
import ApiError from "../ApiError";;

// const transporter = nodemailer.createTransport({
// 	host:
// 		config.node_env === "production"
// 			? "smtp.gmail.com"
// 			: "sandbox.smtp.mailtrap.io",
// 	port: config.node_env === "production" ? 465 : 2525,
// 	secure: config.node_env === "production", // Use 465 port for SSL
// 	auth: {
// 		user:
// 			config.node_env === "production"
// 				? config.user_email
// 				: "adad51abad81c7",
// 		pass:
// 			config.node_env === "production"
// 				? config.user_password
// 				: "89245c118afc28",
// 	},
// });

// OTP Public API Class for sending OTP emails

var transporter = nodemailer.createTransport({
	// host: "sandbox.smtp.mailtrap.io",
	// port: 2525,
	// auth: {
	// 	user: "adad51abad81c7",
	// 	pass: "89245c118afc28",
	// },
	host: config.USER.smtp_host,
	port: config.USER.smtp_port,
	secure: false,
	auth: {
		user: config.USER.smtp_email,
		pass: config.USER.smtp_password,
	},
});

class EmailPublicApi {
	constructor() {}

	async sendOtpEmail(
		type: OTPType,
		user: { email: string; username: string },
		otp: string,
		expirationTime: number // in minutes
	) {
		// Prepare email content and subject based on OTP type
		let emailContent: string;
		let subject: string;

		if (type === OTP_TYPE.EMAIL_VERIFICATION) {
			emailContent = EmailTemplates.EmailVerificationTemplate({
				otp,
				username: user.username,
				expiration: expirationTime,
			});
			subject = "Verify Your Email - ANSTOP";
		} else if (type === OTP_TYPE.PASSWORD_RESET) {
			emailContent = EmailTemplates.ResetPasswordTemplate({
				otp,
				username: user.username,
				expiration: expirationTime,
			});
			subject = "Reset Your Password - ANSTOP";
		} else {
			throw new ApiError(400, "Invalid OTP type");
		}

		// Send the email
		await this.sendEmail(user.email, subject, emailContent);
	}


	// Private method to send the email via Nodemailer
	private async sendEmail(to: string, subject: string, body: string) {
		const mailOptions = {
			from:"no-reply@anstop.com",
			to,
			subject,
			html: body,
		};

		try {
			// Send email using the configured transporter
			const info = await transporter.sendMail(mailOptions);
			console.log("Email sent: ", info.response); // Log the response for debugging
		} catch (error) {
			console.error("Error sending email:", error);
			throw new ApiError(500, "Failed to send email");
		}
	}
}

export { EmailPublicApi };
