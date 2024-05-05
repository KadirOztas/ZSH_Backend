
import express from "express";
import { upload } from "../service/file.service.js";
import { verifyToken } from "../utility/auth.utility.js";

const router = express.Router();

router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}
		return res
			.status(201)
			.json({ message: "File uploaded successfully", file: req.file });
	} catch (error) {
		console.error("File upload error: ", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

export  {router};
