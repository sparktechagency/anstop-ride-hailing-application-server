const GenerateOTP = (length: number = 6): string => {
	const digits = "0123456789";
	let otp = "";
	for (let i = 0; i < length; i++) {
		otp += digits[Math.floor(Math.random() * digits.length)];
	}

	return otp;
};

const GenerateExpirationTime = (minutes: number = 2): Date => {
	return new Date(Date.now() + minutes * 60 * 1000);
};

export const OTPUtils = {
	GenerateOTP,
	GenerateExpirationTime,
};
