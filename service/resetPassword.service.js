import { User } from "../model/user.model.js";
import { Volunteer } from "../model/volunteer.model.js";
import bcrypt from "bcrypt";
import logger from "../config/log.config.js";
import { PasswordResetError } from "../config/error.js";

const resetPassword = async (email, newPassword) => {
	const hashedPassword = await bcrypt.hash(newPassword, 10);

	const user = await User.findOne({ where: { email } });

	if (user) {
		const isSamePassword = await bcrypt.compare(newPassword, user.password);
		if (isSamePassword) {
			throw new PasswordResetError(
				"New password cannot be the same as the old password"
			);
		}
		user.password = hashedPassword;
		await user.save();
		logger.info(`Password reset for user: ${email}`);
		return { role: "user" };
	} else {
		const volunteer = await Volunteer.findOne({ where: { email } });
		if (!volunteer) {
			throw new Error("User or Volunteer not found");
		}
		const isSamePassword = await bcrypt.compare(
			newPassword,
			volunteer.password
		);
		if (isSamePassword) {
			throw new PasswordResetError(
				"New password cannot be the same as the old password"
			);
		}
		volunteer.password = hashedPassword;
		await volunteer.save();
		logger.info(`Password reset for volunteer: ${email}`);
		return { role: "volunteer" };
	}
};

export { resetPassword };
