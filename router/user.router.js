import express from "express";
import { User } from "../model/index.js";
import { verifyRole, verifyToken } from "../utility/auth.utility.js";

const router = express.Router();

router.get("/", verifyRole(["admin"]), verifyToken, async (req, res) => {
	res.send(await User.findAll());
});

router.get("/:id", verifyToken, async (req, res) => {
	res.send(await User.findByPk(req.params.id));
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
