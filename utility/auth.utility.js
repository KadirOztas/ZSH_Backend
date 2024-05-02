import jwt from "jsonwebtoken";

import config from "../config/auth.config.js";
import logger from "../config/log.config.js";


const generateToken = (user) => {
	return jwt.sign(
		{ id: user.id, role: user.role, username: user.username },
		config.secret,
		{ expiresIn: "24h" }
	);
};

const verifyToken = (req, res, next) => {
	let token = req.headers.authorization?.split(" ")[1] || req.session.token;
	if (!token) {
		logger.error("No token provided!");
		return res.status(401).send({
			message: "No token provided!",
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			logger.error("Unauthorized!");
			return res.status(401).send({
				message: "Unauthorized!",
			});
		}

		if (decoded.id === "admin") {
			req.user = { id: "admin", role: "admin", username: "admin@example.com" };
		} else {
			req.user = decoded;
		}

		logger.info("User is authorized", req.user.username);
		next();
	});
};




export {verifyToken, generateToken}