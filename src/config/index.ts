

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

// export with ensuring that all environment variables are defined if any variable are missing then when it used throw error before reached the application logic of where it is used.

export const config = {
	port: process.env.PORT || 3000,
	node_env: process.env.NODE_ENV || "development",
	db_uri: process.env.MONGODB_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "10",
	// jwt_access_secret: process.env.JWT_ACCESS_SECRET || "defaultAccessSecret",
	// jwtExpiry:
	// 	Number(process.env.JWT_ACCESS_EXPIRATION_TIME) || 1000 * 60 * 60 * 3, // default 3 days
	// user_email: process.env.SMTP_USERNAME,
	// user_password: process.env.SMTP_PASSWORD,

	JWT: {
		access_secret: process.env.JWT_ACCESS_SECRET || "defaultAccessSecret",
		access_expiration_time:
			Number(process.env.JWT_ACCESS_EXPIRATION_TIME) || 1000 * 60 * 60 * 3, // default 3 days
		refresh_secret: process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret",
		refresh_expiration_time:
			Number(process.env.JWT_REFRESH_EXPIRATION_TIME) || 1000 * 60 * 60 * 24 * 7, // default 7 days
		verify_email_secret: process.env.JWT_VERIFY_EMAIL_SECRET || "defaultVerifyEmailSecret",
		verify_email_expiration_time:
			Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_TIME) || 1000 * 60 * 60 * 24 * 7, // default 7 days
		
	},
	USER: {
		smtp_host: process.env.SMTP_HOST || "smtp.example.com",
		smtp_port: Number(process.env.SMTP_PORT) || 587,
		smtp_email: process.env.SMTP_USERNAME || "",
		smtp_password: process.env.SMTP_PASSWORD || "",
	},
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
	otpExpiry: parseInt(process.env.OTP_EXPIRY || "", 10) || 300000, // default 5 minutes

	// Twilio configuration
	twilio_api_key_sid: process.env.TWILIO_API_KEY_SID,
	twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
	twilio_api_key_secret: process.env.TWILIO_API_KEY_SECRET,
	twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
	twilio_verification_service_sid:
		process.env.TWILIO_VERIFICATION_SERVICE_SID,

	// Firebase configuration
	firebaseConfig: {
		type: process.env.TYPE,
		project_id: process.env.PROJECT_ID,
		private_key_id: process.env.PRIVATE_KEY_ID,
		private_key: process.env.PRIVATE_KEY,
		client_email: process.env.CLIENT_EMAIL,
		client_id: process.env.CLIENT_ID,
		auth_uri: process.env.AUTH_URI,
		token_uri: process.env.TOKEN_URI,
		auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
		universe_domain: process.env.UNIVERSE_DOMAIN,
	},

	// OTP Configuration

	OTP: {
		VERIFY_EMAIL_OTP_EXPIRATION_TIME:
			parseInt(process.env.VERIFY_EMAIL_OTP_EXPIRATION_TIME || "", 10) ||
			10, // in minutes
		RESET_PASSWORD_OTP_EXPIRATION_TIME:
			parseInt(
				process.env.RESET_PASSWORD_OTP_EXPIRATION_TIME || "",
				10
			) || 10, // in minutes
		MAX_OTP_ATTEMPTS: parseInt(process.env.MAX_OTP_ATTEMPTS || "", 10) || 5,
		ATTEMPT_WINDOW_MINUTES:
			parseInt(process.env.ATTEMPT_WINDOW_MINUTES || "", 10) || 3,
	},

	ACCESS_INVITATION_EXPIRATION_TIME:
		parseInt(process.env.ACCESS_INVITATION_EXPIRATION_TIME || "", 10) || 24, // default 1 day or 24 hours

	base_url: "https://abu-bakar7500.merinasib.shop",
	GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",

	RIDE_REQUEST: {
		BASE_FARE: Number(process.env.BASE_FARE) || 2.50,
		PER_KM_RATE: Number(process.env.PER_KM_RATE) || 1.25,
		PER_MINUTE_RATE: Number(process.env.PER_MINUTE_RATE) || 0.30,
	},

	STRIPE: {
		SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
		WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
		API_VERSION: process.env.STRIPE_API_VERSION || "2025-11-17.clover",
	},
};
