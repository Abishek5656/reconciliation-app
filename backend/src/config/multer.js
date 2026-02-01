import multer from "multer";

// Configure storage
const storage = multer.memoryStorage();

// File filter (optional - to check for excel/csv files)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "text/csv"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only Excel and CSV files are allowed!"),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB limit
});

export default upload;
