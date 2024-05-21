import { User } from "../model/user.model.js";
import logger from "../config/log.config.js";

const resetPasswordDirectly = async (email) => {
	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new Error("User not found");
	}

	await user.destroy();
	await user.save();

	logger.info(`Password reset for user: ${email}`);
};

export { resetPasswordDirectly };
