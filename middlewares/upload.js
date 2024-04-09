import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("tmp/");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});
const limits = { fileSize: 1024 * 1024 * 5 };
const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split(".").pop();
  if (extention === "exe") cb(HttpError(400, "exe extention is not allowed"));
  cb(null, true);
};

const upload = multer({ storage, limits, fileFilter });
export default upload;
