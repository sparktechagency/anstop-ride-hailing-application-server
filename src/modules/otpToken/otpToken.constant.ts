// const OTP_TYPE = ["EMAIL_VERIFICATION", "PASSWORD_RESET"] as const;

const OTP_TYPE = {
	EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
	PASSWORD_RESET: "PASSWORD_RESET",
} as const;

type OTPType = (typeof OTP_TYPE)[keyof typeof OTP_TYPE];

export { OTP_TYPE, OTPType };
