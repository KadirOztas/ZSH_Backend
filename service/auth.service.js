import { User } from "../model/user.model.js";
import { Volunteer } from "../model/volunteer.model.js";
import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import logger from "../config/log.config.js";
import { generateToken } from "../utility/auth.utility.js";

const register = async ({
	email,
	firstname,
	lastname,
	password,
	kanton,
	language,
}) => {
	logger.info(`Registering user... in service ${email}`);
	try {
		const user = await User.create({
			email,
			firstname,
			lastname,
			password,
			role: "user",
			kanton,
			language,
		});

		const token = generateToken(user);

		logger.info(`User is registered ${email}`);
		return user;
	} catch (error) {
		logger.error(`Error creating user... ${error.message}`);
		throw new Error("Error creating user");
	}
};

const registerVolunteer = async ({
	firstname,
	lastname,
	email,
	password,
	kanton,
	phone,
	isAvailable,
	language,
}) => {
	logger.info(`Registering volunteer... in service ${email}`);
	try {
		const volunteer = await Volunteer.create({
			firstname,
			lastname,
			email,
			password,
			role: "volunteer",
			kanton,
			phone,
			isAvailable,
			language,
		});

		const token = generateToken(volunteer);

		logger.info(`Volunteer registered successfully ${email}`);
		return volunteer;
	} catch (error) {
		logger.error(`Error registering volunteer... ${error.message}`);
		throw new Error("Error registering volunteer");
	}
};

const login = async (email, password, res) => {
	logger.info(`Attempting to log in user: ${email}`);
	try {
		const user = await User.findOne({
			where: { email: email, password: password },
		});

		if (!user) {
			throw new Error("User not found");
		}

		const token = generateToken(user);
		res.cookie("accessToken", token, {
			maxAge: 3 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
		});
		res.status(200).json({ token, user });
	} catch (error) {
		logger.error("Login error: ", error);
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

const loginVolunteer = async (email, password, res) => {
	logger.info(`Attempting to log in volunteer: ${email}`);
	try {
		const volunteer = await Volunteer.findOne({
			where: { email: email, password: password },
		});

		if (!volunteer) {
			throw new Error("Volunteer not found");
		}

		const token = generateToken(volunteer);
		res.cookie("accessToken", token, {
			maxAge: 3 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
		});
		res.status(200).json({ token, volunteer });
	} catch (error) {
		logger.error("Login error: ", error);
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

const logout = async (req, res, next) => {
	try {
		res.clearCookie("accessToken", {
			secure: process.env.NODE_ENV === "production",
		});
		res.send("Logout successful");
	} catch (error) {
		next(error);
	}
};

const loginAdmin = async (req, res) => {
	const { email, password } = req.body;
	const adminEmail = "admin@example.com";
	const adminPassword = process.env.FE_PASSWORD;

	if (email === adminEmail && password === adminPassword) {
		const user = {
			id: "admin",
			email: "admin@example.com",
			role: "admin",
		};

		const token = generateToken(user);

		res.cookie("accessToken", token, {
			maxAge: 86400 * 1000,
		});

		res.json({ message: "Admin login successful", accessToken: token });
	} else {
		res.status(401).send({ message: "Invalid credentials" });
	}
};

export default {
	register,
	login,
	loginAdmin,
	logout,
	registerVolunteer,
	loginVolunteer,
};
