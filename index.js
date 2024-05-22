import "./loadEnv.js";
import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const local_url = process.env.CORS_LOCAL_URL;
const deployment_url = process.env.CORS_DEPLOYMENT_URL;
const allowedOrigins=[local_url, deployment_url]
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				const msg =
					"The CORS policy for this site does not allow access from the specified Origin.";
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		credentials: true,
	})
);
app.use(morgan(process.env.ACCESS_LOG_FORMAT));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

import { router as fileRouter } from "./router/file.router.js";
app.use("/files", fileRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
import { router as userRouter } from "./router/user.router.js";
app.use("/users", userRouter);
import { router as volunteerRouter } from "./router/volunteer.router.js";
app.use("/volunteer-availability", volunteerRouter);
import { router as authRouter } from "./router/auth.router.js";
import logger from "./config/log.config.js";
app.use("/auth", authRouter);
import { router as resetPasswordRouter } from "./router/resetPassword.router.js"
app.use("/password", resetPasswordRouter);
app.use((err, req, res, next) => {
	console.error(err.stack); // Log the error stack trace
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).send(err.message || "Something broke!"); // Send a generic error response
});
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});
process.on("uncaughtException", (err) => {
	logger.error(`Uncaught Exception ${err.message}`);
	process.exit(0);
});

app.listen(process.env.SERVER_PORT, () =>
	logger.info("Server is running on port 9010")
);
