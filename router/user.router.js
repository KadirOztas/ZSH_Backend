import express from "express";
import { User } from "../model/index.js";
import { verifyRole, verifyToken } from "../utility/auth.utility.js";

const router = express.Router();

router.get(
	"/",
	verifyToken,
	verifyRole(["admin", "volunteer"]),
	async (req, res) => {
		res.send(await User.findAll());
	}
);

router.get("/:id", verifyToken, async (req, res) => {
	const userId = req.user.id;
	const userRole = req.user.role;
	const requestedUserId = req.params.id;

	if (userRole !== "admin" && userId !== requestedUserId) {
		return res.status(403).json({ message: "Unauthorized to view this data" });
	}

	try {
		const user = await User.findByPk(requestedUserId, {
			attributes: [
				"id",
				"firstname",
				"lastname",
				"email",
				"role",
				"kanton",
				"language",
				"createdAt",
				"updatedAt",
			],
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/", verifyToken, async (req, res) => {
	res.send(await User.create(req.body));
});

router.put("/:id", verifyRole(["admin"]), verifyToken, async (req, res) => {
	res.send(await User.update(req.body, { where: { id: req.params.id } }));
});

router.delete("/:id", verifyRole(["admin"]), verifyToken, async (req, res) => {
	await User.destroy({ where: { id: req.params.id } });
	// you send email to user
	// you send email adminsitr
	// you delte user's document
	res.send("Delete user");
});

export { router };
