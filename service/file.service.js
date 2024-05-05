import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const limits = {
	fileSize: 1024 * 1024 * 10, // 10 MB limit
};

// File upload filter (to allow only certain file types)
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype.startsWith("image/") ||
		file.mimetype.startsWith("video/")
	) {
		cb(null, true);
	} else {
		cb(new Error("Unsupported file type"), false);
	}
};

const upload = multer({ storage, limits, fileFilter });

export { upload };
