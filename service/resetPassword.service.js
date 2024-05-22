import { User } from "../model/user.model.js"
import logger from "../config/log.config.js";

const resetPassword = async (email, newPassword) => {
	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new Error("User not found");
	}

	if (user.password === newPassword) {
		throw new Error("New password cannot be the same as the old password");
	}

	user.password = newPassword;
	await user.save();

	logger.info(`Password reset for user: ${email}`);
};

export { resetPassword };
