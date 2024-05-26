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

	const expiresIn = user.role === "admin" ? "48h" : "3h";

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

const verifyRole = (roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).send({ message: "Forbidden: Insufficient role" });
		}
		next();
	};
};




export {verifyToken, generateToken, verifyRole}