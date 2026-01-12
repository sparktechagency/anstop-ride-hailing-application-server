const EmailVerificationTemplate = (payload: {
	otp: string;
	username: string;
	expiration: number;
}): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your BOARDPIX Account</title>
  <style>
    body {
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      color: #333;
    }
    .email-wrapper {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }
    .email-card {
      background: white;
      border-radius: 12px;
      max-width: 540px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border-top: 5px solid #50D4FB;
    }
    .email-header {
      text-align: center;
    }
    .email-header h1 {
      font-size: 26px;
      margin: 0;
      color: #50D4FB;
    }
    .email-body {
      margin-top: 24px;
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
    }
    .otp-container {
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      background-color: #e0f7fa;
      color: #00796b;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 6px;
      padding: 14px 30px;
      border-radius: 10px;
      border: 2px solid #50D4FB;
      display: inline-block;
    }
    .cta-button {
      display: inline-block;
      background-color: #50D4FB;
      color: white;
      font-weight: bold;
      padding: 12px 25px;
      border-radius: 8px;
      text-decoration: none;
      margin-top: 30px;
    }
    .cta-button:hover {
      background-color: #4db6e0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 40px;
    }
    .footer strong {
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <div class="email-header">
        <h1>🔐 Verify Your BOARDPIX Account</h1>
      </div>
      <div class="email-body">
        <p>Hello ${payload?.username || "there"},</p>
        <p>Thank you for choosing our BOARDPIX. To complete your registration, please use the OTP below to verify your account:</p>
        <div class="otp-container">
          <div class="otp-code">${payload?.otp || "Sorry for the inconvenience. Please try again later"}</div>
        </div>
        <p>This OTP will expire in <strong>${payload?.expiration || "Sorry for the inconvenience. Please try again later"} minutes</strong>. Please use it promptly to avoid delays.</p>
        <p>If you did not request this verification, feel free to ignore this email.</p>
        <a href="#" class="cta-button">Verify Now</a>
        <p>Best Regards,<br/>The BOARDPIX Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} <strong>BOARDPIX</strong>. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

const ResetPasswordTemplate = (payload: {
	otp: string;
	username: string;
	expiration: number;
}): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Forgot Password - Pet Hotel</title>
  <style>
    body {
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      color: #333;
    }
    .email-wrapper {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .email-card {
      background: white;
      border-radius: 12px;
      max-width: 540px;
      width: 100%;
      padding: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border-top: 5px solid #50D4FB;
    }
    .email-header {
      text-align: center;
    }
    .email-header h1 {
      font-size: 24px;
      margin: 0;
      color: #50D4FB;
    }
    .email-body {
      margin-top: 20px;
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
    }
    .otp-container {
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      background-color: #e0f7fa;
      color: #00796b;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 6px;
      padding: 14px 30px;
      border-radius: 10px;
      border: 2px solid #50D4FB;
      display: inline-block;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 30px;
    }
    .footer strong {
      color: #475569;
    }
    @media (max-width: 600px) {
      .email-card {
        padding: 15px;
      }
      .email-header h1 {
        font-size: 22px;
      }
      .email-body {
        font-size: 14px;
      }
      .otp-code {
        font-size: 28px;
        padding: 12px 25px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <div class="email-header">
        <h1>🔑 Forgot Your Password?</h1>
      </div>
      <div class="email-body">
        <p>Hello ${payload?.username || "there"},</p>
        <p>We received a request to reset the password for your BOARDPIX account.</p>
        <p>To proceed with resetting your password, please enter the following one-time password (OTP) in the app or website:</p>
        <div class="otp-container">
          <div class="otp-code">${payload?.otp || "Sorry for the inconvenience. Please try again later"}</div>
        </div>
        <p>This OTP is valid for <strong>${payload?.expiration || "Sorry for the inconvenience. Please try again later"} minutes</strong>. Do not share it with anyone.</p>
        <p>If you did not request a password reset, please ignore this email or contact support.</p>
        <p>Best regards,<br/>The BOARDPIX Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} <strong>BOARDPIX</strong>. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

const AccessInvitationTemplate = (payload: {
	username?: string;
	inviter?: string;
	teamName?: string;
	inviteLink: string;
	expiration?: number;
}): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>You're Invited to Join ${payload?.teamName || "a Team"} - BOARDPIX</title>
  <style>
    body {
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      color: #333;
    }
    .email-wrapper {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
    }
    .email-card {
      background: white;
      border-radius: 12px;
      max-width: 540px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border-top: 5px solid #50D4FB;
    }
    .email-header {
      text-align: center;
    }
    .email-header h1 {
      font-size: 26px;
      margin: 0;
      color: #50D4FB;
    }
    .email-body {
      margin-top: 24px;
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #50D4FB;
      color: white;
      font-weight: bold;
      padding: 14px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 16px;
      transition: background-color 0.2s ease;
    }
    .cta-button:hover {
      background-color: #4db6e0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 40px;
    }
    .footer strong {
      color: #475569;
    }
    @media (max-width: 600px) {
      .email-card {
        padding: 20px;
      }
      .email-header h1 {
        font-size: 22px;
      }
      .email-body {
        font-size: 14px;
      }
      .cta-button {
        font-size: 14px;
        padding: 12px 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <div class="email-header">
        <h1>🎉 You’ve Been Invited!</h1>
      </div>
      <div class="email-body">
        <p>Hi ${payload?.username || "there"},</p>
        <p><strong>${payload?.inviter || "A teammate"}</strong> has invited you to join the <strong>${payload?.teamName || "BOARDPIX Team"}</strong> on BOARDPIX.</p>
        <p>Accepting this invitation will give you access to collaborate, share photos, and manage content with your team.</p>

        <div class="cta-container">
          <p>Referral code: ${payload.inviteLink}</p>
        </div>

        <p>This invitation will expire in <strong>${payload?.expiration || "24"} hours</strong>. Please make sure to accept it before it expires.</p>
        <p>If you weren’t expecting this, you can safely ignore this email.</p>

        <p>Best regards,<br/>The BOARDPIX Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} <strong>BOARDPIX</strong>. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;


export const EmailTemplates = {
	EmailVerificationTemplate,
	ResetPasswordTemplate,
  AccessInvitationTemplate
};
