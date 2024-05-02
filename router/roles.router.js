import express from "express";
import { getVolunteers } from "../service/roles.service.js";
import { verifyToken } from "../utility/auth.utility.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const volunteers = await getVolunteers();
		res.json(volunteers);
	} catch (error) {
		res.status(500).send({
			message: "An error occurred while fetching volunteers.",
			error: error.message,
		});
	}
});

router.get(
	"/:id",
	verifyToken,
	
	(req, res) => {
		const { id } = req.params;
		res.json({ message: `Info for volunteer ${id}` });
	}
);

router.post("/", verifyToken,  (req, res) => {
	res.json({ message: "Volunteer created successfully" });
});

router.put(
	"/:id",
	verifyToken,
	
	(req, res) => {
		const { id } = req.params;
		const { isAvailable } = req.body;
		const volunteerId = req.user.id;

		if (req.user.role === "volunteer" && volunteerId !== id) {
			return res
				.status(403)
				.json({ message: "Unauthorized to update other profiles" });
		}
		res.json({
			message: `Availability updated successfully for volunteer ${id}`,
		});
	}
);

router.delete("/:id", verifyToken, (req, res) => {
	const { id } = req.params;
	res.json({ message: `Volunteer ${id} deleted successfully` });
});

export { router };
