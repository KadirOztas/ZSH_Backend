import axios from "axios";

const verifyHCaptcha = async (token) => {
	try {
		console.log("Verifying hCaptcha token:", token);
		const response = await axios.post(
			`https://api.hcaptcha.com/siteverify`,
			`secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${token}`,
			{
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			}
		);
		console.log("hCaptcha verification response:", response.data);
		return response.data.success;
	} catch (error) {
		console.error("Error verifying hCaptcha:", error);
		return false;
	}
};

export { verifyHCaptcha };
