import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { verifyToken } from "../utility/auth.utility.js";
import { upload } from "../service/file.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const kantons = ["uri", "zug", "luzern", "nidwalden", "obwalden", "schwyz"];


kantons.forEach((kanton) => {
	router.post(
		`/upload/${kanton}`,
		verifyToken,
		upload.single("file"),
		(req, res, next) => {
			if (!req.file) {
				return res.status(400).json({ message: "No files were uploaded." });
			}
			const file = req.file;
			const uploadPath = path.join(
				__dirname,
				"../uploads",
				kanton,
				file.originalname
			);
			fs.promises
				.copyFile(file.path, uploadPath)
				.then(() => {
					next();
				})
				.catch((err) => {
					console.error("File upload error: ", err);
					return res.status(500).json({ message: "File upload failed." });
				});
		},
		(req, res) => {
			res
				.status(201)
				.json({ message: "File uploaded successfully", file: req.file.path });
		}
	);
	router.get(`/upload/${kanton}`, (req, res) => {
		const dirPath = path.join(__dirname, "../uploads", kanton);
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
