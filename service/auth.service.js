import { User } from "../model/user.model.js";
import { Volunteer } from "../model/volunteer.model.js";
import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import logger from "../config/log.config.js";
import sendEmail from "./email.service.js";
import { generateToken } from "../utility/auth.utility.js"
const register = async ({ email, firstname, lastname, password, kanton }) => {
	logger.info(`Registering user... in service ${email}`);
	try {
		const user = await User.create({
			email,
			firstname,
			lastname,
			password,
			role: "user",
			kanton,
		});
		logger.info(`User is registered ${email}`);

		await sendEmail({
			from: "m.abdulkadiroztas@gmail.com",
			to: email,
			subject: "Welcome to Our Platform!",
			message: "Thank you for registering.",
		});

		return user;
	} catch (error) {
		logger.error(`Error creating user... ${error.message}`);
		throw new Error("Error creating user");
	}
};



const login = async (email, password) => {
	let user = await User.findOne({
		where: { email: email, password: password },
	});

	if (!user) {
		user = await Volunteer.findOne({
			where: { email: email, password: password },
		});
	}

	if (!user) {
		throw new Error("User not found");
	}

	const token = jwt.sign({ id: user.id }, config.secret, {
		algorithm: "HS256",
		expiresIn: 86400, // 24 hours
	});

	return { user, token };
};

const logout = (req, res) => {
	res.cookie("accessToken", "", { maxAge: 0, httpOnly: true });
	res.send("Logout successful");
};
const loginAdmin = async (req, res) => {
	const { email, password } = req.body;

	const adminEmail = "admin@example.com";
	const adminPassword = process.env.FE_PASSWORD;

	if (email === adminEmail && password === adminPassword) {
		const user = {
			id: "admin",
			username: "admin@example.com",
			role: "admin",
		};

		const token = jwt.sign(
			{ id: user.id, role: user.role, username: user.username },
			config.secret,
			{ expiresIn: "24h" }
		);

		res.cookie("accessToken", token, {
			httpOnly: true,
			maxAge: 86400 * 1000,
		});

		res.json({ message: "Admin login successful", accessToken: token });
	} else {
		res.status(401).send({ message: "Invalid credentials" });
	}
};


export default { register, login, loginAdmin, logout };
