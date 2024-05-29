import express from "express";
import { resetPassword } from "../service/resetPassword.service.js";
import logger from "../config/log.config.js";

const router = express.Router();

router.post("/reset-password", async (req, res, next) => {
	const { email, newPassword } = req.body;

	try {
		const result = await resetPassword(email, newPassword);
		res.status(200).json(result);
	} catch (error) {
		logger.error("Error resetting password:", error);
		next(error);
	}
});

export {router}
