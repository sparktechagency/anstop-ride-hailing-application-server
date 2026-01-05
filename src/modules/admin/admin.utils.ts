import { config } from "../../config";
import { Admin } from "./admin.model";
import bcrypt from "bcrypt";

export const ForgotPasswordEmail = (
	username: string,
	otp: string,
	expiryTime: string
) => {
	return `
	<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Verification</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.5;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            padding: 32px 40px 24px 40px;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin: 0;
        }
        .content {
            padding: 32px 40px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 24px;
            color: #111827;
        }
        .message {
            font-size: 16px;
            margin-bottom: 24px;
            color: #374151;
            line-height: 1.6;
        }
        .otp-section {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
            margin: 32px 0;
            text-align: center;
        }
        .otp-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #111827;
            letter-spacing: 4px;
            margin: 0;
            font-family: 'Courier New', Monaco, monospace;
        }
        .expiry-info {
            font-size: 14px;
            color: #6b7280;
            margin-top: 16px;
        }
        .security-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 4px 4px 0;
        }
        .security-notice p {
            margin: 0;
            font-size: 14px;
            color: #92400e;
            font-weight: 500;
        }
        .instructions {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 4px;
            margin: 24px 0;
        }
        .instructions h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #111827;
            font-weight: 600;
        }
        .instructions ol {
            margin: 0;
            padding-left: 20px;
            color: #374151;
        }
        .instructions li {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .footer {
            padding: 24px 40px 32px 40px;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .footer-content {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
        }
        .company-info {
            margin-top: 16px;
            font-size: 12px;
            color: #9ca3af;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 24px 0;
        }
        @media (max-width: 600px) {
            .content, .header, .footer {
                padding-left: 20px;
                padding-right: 20px;
            }
            .otp-code {
                font-size: 24px;
                letter-spacing: 2px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">RYDR</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Dear ${username},
            </div>

            <div class="message">
                We have received a request to reset the password for your account. To proceed with the password reset, please use the verification code provided below.
            </div>

            <!-- OTP Code Section -->
            <div class="otp-section">
                <div class="otp-label">Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="expiry-info">This code expires in ${expiryTime} minutes</div>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
                <p><strong>Security Notice:</strong> If you did not request this password reset, please ignore this email. Your account security has not been compromised.</p>
            </div>
        </div>

    </div>
</body>
</html>
	`;
};

// create admin once if not exist when server boots

/**
 * export type TAdmin = {
    username: TUserName;
    email: string;
    password: string;
    phoneNumber?: string;
    avatar?: string;
    role: TRoles;
    isVerified: boolean;
    isOnline: boolean;
    isDeleted: boolean;
    fcmTokenDetails: TFcmTokenDetails;
    createdAt: Date;
    updatedAt: Date;
 };
 */

export const createAdminIfNotExist = async () => {
	const adminCount = await Admin.countDocuments();


	if (adminCount === 0) {
		const admin = new Admin({
			username: {
				firstName: "admin",
				lastName: "admin",
			},
			email: "admin@gmail.com",
			password: "admin@123",
			role: "Admin",
			isVerified: true,
			isOnline: false,
			isDeleted: false,
			fcmTokenDetails: {
				tokens: [],
			},
		});
		await admin.save();
	}
};
