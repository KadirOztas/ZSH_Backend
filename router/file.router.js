import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { verifyToken } from "../utility/auth.utility.js";
import { upload } from "../service/file.service.js";
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const kantons = ["uri", "zug", "luzern", "nidwalden", "obwalden", "schwyz"];

kantons.forEach((kanton) => {
	router.post(
		"/upload/:kanton",
		verifyToken,
		upload.single("file"),
		(req, res) => {
			console.log(
				`File upload request received for kanton: ${req.params.kanton}`
			);
			console.log(`Request ${JSON.stringify(Object.keys(req))}`);
			console.log("File",req.file);
			console.log("Files", req.files);
			if (!req.file) {
				console.log("No file was uploaded.");
				return res.status(400).json({ message: "No files were uploaded." });
			}
			const file = req.file;
			console.log(`File saved to: ${file.path}`);
			res.status(201).json({
				message: "File uploaded successfully",
				path: file.path,
			});
		}
	);

	router.get(`/upload/${kanton}`, (req, res) => {
		const dirPath = path.join(__dirname, "../uploads", kanton);
		console.log(`Processing file upload at ${new Date().toISOString()}`);
		console.log(`GET request URL: ${req.originalUrl}`);

		fs.readdir(dirPath, (err, files) => {
			if (err) {
				console.error(`Error reading the directory for ${kanton}:`, err);
				return res
					.status(500)
					.json({ message: "Unable to access file directory." });
			}
			const fileUrls = files.map(
				(file) =>
					`${req.protocol}://${req.get("host")}/uploads/${kanton}/${file}`
			);
			res.json(fileUrls);
		});
	});
});

export { router };
