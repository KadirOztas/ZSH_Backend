import express from "express";
import logger from "../config/log.config.js";
import { resetPasswordDirectly } from "../service/resetPassword.service.js";

const router = express.Router();

router.post("/reset-password", async (req, res, next) => {
	const { email } = req.body;

	try {
		await resetPasswordDirectly(email);
		res.status(200).send("Password reset successfully");
	} catch (error) {
		logger.error("Error resetting password:", error);
		next(error);
	}
});

export {router}
