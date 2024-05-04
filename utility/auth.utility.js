import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import logger from "../config/log.config.js";


const generateToken = (user) => {
	const payload = {
		id: user.id,
		role: user.role,
		username: user.username,
		email: user.email,
	};

	const expiresIn = user.role === "admin" ? "48h" : "24h";

	return jwt.sign(payload, config.secret, { expiresIn });
};

const verifyToken = (req, res, next) => {
	const token = req.cookies?.accessToken

	if (!token) {
		logger.error("No token provided!");
		return res.status(401).send({ message: "No token provided!" });
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			logger.error("Unauthorized!");
			return res.status(401).send({ message: "Unauthorized!" });
		}

		req.user = decoded;
		logger.info("User is authorized", req.user.username);
		next();
	});
};





export {verifyToken, generateToken}