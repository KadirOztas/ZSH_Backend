import express from "express";
import { Volunteer } from "../model/volunteer.model.js";
import { verifyToken } from "../utility/auth.utility.js";
import VolunteerService from "../service/volunteer.service.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
	try {
		const volunteers = await VolunteerService.getAllVolunteers();
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.get("/:kanton",verifyToken, async (req, res) => {
	const kanton = req.params.kanton;
	try {
		const volunteers = await VolunteerService.getVolunteersByKanton(kanton);
		res.json(volunteers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.get("/:id", verifyToken, async (req, res) => {
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
		const updatedVolunteer = await VolunteerService.updateVolunteer(id, data);
		res.json(updatedVolunteer);
	} catch (error) {
		res.status(404).json({ error: error.message });
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
