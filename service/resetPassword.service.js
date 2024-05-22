import { User } from "../model/user.model.js";
import { Volunteer } from "../model/volunteer.model.js";
import logger from "../config/log.config.js";

class PasswordResetError extends Error {
	constructor(message) {
		super(message);
		this.name = "PasswordResetError";
	}
}

const resetPassword = async (email, newPassword) => {
	const user = await User.findOne({ where: { email } });

	if (user) {
		if (user.password === newPassword) {
			throw new PasswordResetError(
				"New password cannot be the same as the old password"
			);
		}
		user.password = newPassword;
		await user.save();
		logger.info(`Password reset for user: ${email}`);
		return { role: "user" };
	} else {
		const volunteer = await Volunteer.findOne({ where: { email } });

		if (!volunteer) {
			throw new PasswordResetError("User or Volunteer not found");
		}

		if (volunteer.password === newPassword) {
			throw new PasswordResetError(
				"New password cannot be the same as the old password"
			);
		}
		volunteer.password = newPassword;
		await volunteer.save();
		logger.info(`Password reset for volunteer: ${email}`);
		return { role: "volunteer" };
	}
};

export { resetPassword };
