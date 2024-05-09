import express from "express";
import { verifyToken } from "../utility/auth.utility.js";
import VolunteerService from "../service/volunteer.service.js";

const router = express.Router();

router.get("/",verifyToken, async (req, res) => {
	try {
		const volunteers = await VolunteerService.getAllVolunteers();
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.get("/:kanton", async (req, res) => {
	const kanton = req.params.kanton;
	const lang = req.query.lang || "en";
	try {
		const volunteers = await VolunteerService.getVolunteersByKanton(
			kanton,
			lang
		);
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.get("/:id",verifyToken, async (req, res) => {
	const id = req.params.id;
	try {
		const volunteer = await VolunteerService.getVolunteerById(id);
		res.json(volunteer);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

router.post("/", verifyToken, async (req, res) => {
	 const data = req.body;
		try {
			const newVolunteer = await VolunteerService.createVolunteer(data);
			res.status(201).json(newVolunteer);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
});

router.put("/:id", verifyToken, async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	try {
		const volunteer = await VolunteerService.updateVolunteer(id, data);
		res.json(volunteer);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.put("/:id/availability", verifyToken, async (req, res) => {
	const userId = req.user.id;
	const volunteerId = req.params.id;
	const { isAvailable } = req.body;

	if (userId.toString() !== volunteerId) {
		return res
			.status(403)
			.json({ message: "Unauthorized to change this data" });
	}

	try {
		const volunteer = await VolunteerService.updateVolunteerAvailability(
			volunteerId,
			isAvailable
		);
		res.json(volunteer);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.get("/:id/availability", verifyToken, async (req, res) => {
	const userId = req.user.id;
	const volunteerId = req.params.id;

	try {
		const volunteer = await VolunteerService.getVolunteerById(id);

		if (userId.toString() !== volunteerId) {
			return res
				.status(403)
				.json({ message: "Unauthorized to view this data" });
		}

		res.json({ isAvailable: volunteer.isAvailable });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/:id", verifyToken, async (req, res) => {
	const id = req.params.id;
	try {
		const deletedVolunteer = await VolunteerService.deleteVolunteer(id);
		res.json(deletedVolunteer);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

export { router };
