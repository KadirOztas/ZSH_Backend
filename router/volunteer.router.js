import express from "express";
import { verifyRole, verifyToken } from "../utility/auth.utility.js";
import VolunteerService from "../service/volunteer.service.js";
import languageOptions from "../data/languages.js";
const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), async (req, res) => {
	try {
		const volunteers = await VolunteerService.getAllVolunteers();
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.get("/kanton/:kanton", async (req, res) => {
	const kanton = req.params.kanton;
	try {
		const volunteers = await VolunteerService.getVolunteersByKanton(kanton);
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/id/:id", verifyRole(["admin"]), verifyToken, async (req, res) => {
	const id = req.params.id;
	try {
		const volunteer = await VolunteerService.getVolunteerById(id);
		if (!volunteer) {
			return res.status(404).json({ message: "Volunteer not found" });
		}
		res.json(volunteer);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
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
router.put(
	"/availability/:id",
	verifyToken,
	async (req, res) => {
		const userId = req.user.id;
		const userRole = req.user.role;
		const volunteerId = req.params.id;
		const { isAvailable } = req.body;

		if (userRole !== "volunteer") {
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
			res.status(500).json({ error: error.message });
		}
	}
);

router.get("/languages", async (req, res) => {
	try {
		res.json(languageOptions);
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
