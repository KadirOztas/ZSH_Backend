import express from "express";
import { verifyRole, verifyToken } from "../utility/auth.utility.js";
import VolunteerService from "../service/volunteer.service.js";
import languageOptions from "../data/languages.js";
import logger from "../config/log.config.js";
import rateLimit from "express-rate-limit";
import { verifyHCaptcha } from "../service/hcaptcha.service.js";

const router = express.Router();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 30, // 30 requests in 15 minutes
	message: "Too many requests from this IP, please try again later.",
});

router.get("/", verifyToken, verifyRole(["admin"]), async (req, res) => {
	try {
		const volunteers = await VolunteerService.getAllVolunteers();
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/kanton/:kanton", limiter, async (req, res) => {
	const captchaToken = req.headers["x-captcha-token"];

	if (!captchaToken) {
		return res.status(400).json({ error: "Captcha token is required" });
	}

	const isCaptchaValid = await verifyHCaptcha(captchaToken);
	if (!isCaptchaValid) {
		return res.status(400).json({ error: "Invalid captcha" });
	}

	const kanton = req.params.kanton;
	const limit = parseInt(req.query.limit) || 10;

	try {
		const volunteers = await VolunteerService.getVolunteersByKanton(
			kanton,
			limit
		);
		const filteredVolunteers = volunteers.map((volunteer) => ({
			firstname: volunteer.firstname,
			lastname: volunteer.lastname,
			kanton: volunteer.kanton,
			language: volunteer.language,
			isAvailable: volunteer.isAvailable,
			id: volunteer.id,
			phone: volunteer.phone,
		}));
		res.json(filteredVolunteers);
	} catch (error) {
		console.error("Error fetching volunteers by kanton:", error);
		res.status(500).json({ error: error.message });
	}
});

router.get("/languages", async (req, res) => {
	try {
		res.json(languageOptions);
	} catch (error) {
		logger.error("Error fetching languages:", error);
		res.status(500).json({ error: error.message });
	}
});

router.post("/", verifyToken, verifyRole(["admin"]), async (req, res) => {
	const data = req.body;
	try {
		const newVolunteer = await VolunteerService.createVolunteer(data);
		res.status(201).json(newVolunteer);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.put(
	"/availability/:id",
	verifyToken,
	verifyRole(["admin", "volunteer"]),
	async (req, res) => {
		const userId = req.user.id;
		const userRole = req.user.role;
		const volunteerId = req.params.id;
		const { isAvailable } = req.body;

		console.log("User ID: ", userId);
		console.log("Volunteer ID: ", volunteerId);

		if (userRole !== "volunteer" || userId.toString() !== volunteerId) {
			return res
				.status(403)
				.json({ message: "Unauthorized to change this data" });
		}

		try {
			const volunteer = await VolunteerService.updateVolunteerAvailability(
				userId,
				volunteerId,
				isAvailable
			);
			res.json(volunteer);
		} catch (error) {
			logger.error("Error updating volunteer availability", error);
			res.status(500).json({ error: error.message });
		}
	}
);

router.get(
	"/:id",
	verifyToken,
	verifyRole(["admin", "volunteer"]),
	async (req, res) => {
		const id = req.params.id;
		try {
			const volunteer = await VolunteerService.getVolunteerById(id);
			res.json(volunteer);
		} catch (error) {
			logger.error("Error fetching volunteer by id", error);
			res.status(500).json({ error: error.message });
		}
	}
);

router.put("/:id", verifyToken, verifyRole(["admin"]), async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	try {
		const volunteer = await VolunteerService.updateVolunteer(id, data);
		res.json(volunteer);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/:id", verifyRole(["admin"]), verifyToken, async (req, res) => {
	const id = req.params.id;
	try {
		const deletedVolunteer = await VolunteerService.deleteVolunteer(id);
		res.json(deletedVolunteer);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

export { router };
