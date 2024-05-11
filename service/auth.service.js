import { User } from "../model/user.model.js";
import { Volunteer } from "../model/volunteer.model.js";
import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import logger from "../config/log.config.js";
import sendEmail from "./email.service.js";
import { generateToken } from "../utility/auth.utility.js";
import { response } from "express";
const register = async ({ email, firstname, lastname, password, kanton, language }) => {
	logger.info(`Registering user... in service ${email}`);
	try {
		const user = await User.create({
			email,
			firstname,
			lastname,
			password,
			role: "user",
			kanton,
			language
		});

		const token = generateToken(user);

		await sendEmail({
			from: "email@example.com",
			to: email,
			subject: "Welcome to Our Platform!",
			message: `Thank you for registering. Your token: ${token}`,
		});

		logger.info(`User is registered ${email}`);
		return user;
	} catch (error) {
		logger.error(`Error creating user... ${error.message}`);
		throw new Error("Error creating user");
	}
};

const login = async (email, password, res) => {
	try {
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

		const token = generateToken(user);
		res.cookie("accessToken", token, {
			maxAge: 3 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === "production",
		});
		res.status(200).json({ token, user });
	} catch (error) {
		console.error("Login error: ", error);
		if (!res.headersSent) {
			res
				.status(500)
				.json({ message: "Internal Server Error", error: error.message });
		}
	}
};


const logout = async (req, res, next) => {
	try {
		res.clearCookie("accessToken", {
			secure: process.env.NODE_ENV === "production",
		});
		res.send("Logout successful");
	} catch (error) {
		next(error)
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

export default { register, login, loginAdmin, logout };
