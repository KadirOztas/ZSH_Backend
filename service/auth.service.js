import { User } from "../model/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { Volunteer } from "../model/volunteer.model.js";
import logger from "../config/log.config.js";
import { generateToken } from "../utility/auth.utility.js";
import bcrypt from "bcrypt";
import { DuplicateEmailError, ValidationError } from "../config/error.js";

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
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			throw new DuplicateEmailError("Email already in use");
		}

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			id: uuidv4(),
			email,
			firstname,
			lastname,
			password: hashedPassword,
			role: "user",
			kanton,
			language,
		});

		const token = generateToken(user);

		logger.info(`User is registered ${email}`);
		return user;
	} catch (error) {
		if (error instanceof DuplicateEmailError) {
			logger.error(`Duplicate email error: ${error.message}`);
			throw error;
		}
		logger.error(`Error creating user... ${error.message}`);
		throw new ValidationError("Error creating user");
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
		const existingVolunteer = await Volunteer.findOne({ where: { email } });
		if (existingVolunteer) {
			throw new DuplicateEmailError("Email already in use");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const volunteer = await Volunteer.create({
			id: uuidv4(),
			firstname,
			lastname,
			email,
			password: hashedPassword,
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
		if (error instanceof DuplicateEmailError) {
			logger.error(`Duplicate email error: ${error.message}`);
			throw error;
		}
		logger.error(`Error registering volunteer... ${error.message}`);
		throw new ValidationError("Error registering volunteer");
	}
};

const login = async (email, password, res) => {
	logger.info(`Attempting to log in user or volunteer: ${email}`);
	try {
		let user = await User.findOne({ where: { email } });
		let userType = "user";

		if (!user) {
			user = await Volunteer.findOne({ where: { email } });
			userType = "volunteer";
		}

		if (!user) {
			throw new Error("User not found");
		}

		logger.info(`User found: ${user.email}, comparing passwords...`);

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			logger.error("Invalid password entered");
			throw new Error("Invalid password");
		}

		logger.info("Password is valid, generating token...");

		const token = generateToken(user);
		res.cookie("accessToken", token, {
			maxAge: 3 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
		});

		if (userType === "user") {
			res.status(200).json({ token, user });
		} else {
			res.status(200).json({ token, volunteer: user });
		}
	} catch (error) {
		logger.error("Login error: ", error);
		res
			.status(401)
			.json({ message: "Invalid email or password", error: error.message });
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
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
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
};
