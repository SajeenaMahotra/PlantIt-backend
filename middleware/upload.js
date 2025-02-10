const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store images in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename

    },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (JPEG, PNG, GIF)."));
    }
};

// Set upload limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

module.exports = upload;