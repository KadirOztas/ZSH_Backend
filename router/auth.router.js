import express from "express";
import authService from "../service/auth.service.js";
import sendEmail from "../service/email.service.js";
import logger from "../config/log.config.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
	logger.info("Registering user...", req.body.email);
	const user = req.body;
	try {
		const registeredUser = await authService.register(user);
		logger.info("User has registered successfully", req.body.email);
		res.json({ message: "Register", user: registeredUser });
	} catch (error) {
		logger.error("Error registering user", error);
		next(error);
	}
});

router.post("/register/volunteer", async (req, res, next) => {
	logger.info("Registering volunteer...", req.body.email);
	const volunteer = req.body;
	try {
		const registeredVolunteer = await authService.registerVolunteer(volunteer);
		logger.info("Volunteer has registered successfully", req.body.email);
		res.json({ message: "Register", volunteer: registeredVolunteer });
	} catch (error) {
		logger.error("Error registering volunteer", error);
		next(error);
	}
});

router.post("/send-welcome-email", async (req, res) => {
	const { email, subject, message } = req.body;
	try {
		await sendEmail({ from: "email@example.com", to: email, subject, message });
		res.status(200).send("Welcome email sent");
	} catch (error) {
		logger.error("Error sending welcome email", error);
		res.status(500).send("Error sending welcome email");
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		await authService.login(email, password, res);
	} catch (error) {
		logger.error("Login error caught in router: ", error.message);
	}
});

router.post("/login/volunteer", async (req, res) => {
	const { email, password } = req.body;
	try {
		await authService.loginVolunteer(email, password, res);
	} catch (error) {
		logger.error("Login error caught in router: ", error.message);
	}
});

router.post("/logout", authService.logout);
router.post("/login-admin", authService.loginAdmin);

export { router };
