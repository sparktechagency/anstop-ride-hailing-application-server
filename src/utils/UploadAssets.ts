// import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import multer from "multer";
// import { config } from "../config";

// cloudinary.config({
//     cloud_name: config.cloudinary_cloud_name,
//     api_key: config.cloudinary_api_key,
//     api_secret: config.cloudinary_api_secret,
// });

// export const uploadAssets = (
//     filename: string,
//     path: string,
// ): Promise<{ secure_url: string; bytes: number }> => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(path, { public_id: filename.trim() }, function (error, result) {
//             if (error) {
//                 reject(error);
//             }
//             resolve(result as UploadApiResponse);
//             // delete a file asynchronously
//             fs.unlink(path, (err) => {
//                 if (err) {
//                     reject(err);
//                 }
//             });
//         });
//     });
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadPath = "/tmp/uploads/";
//         fs.mkdirSync(uploadPath, { recursive: true });
//         cb(null, uploadPath);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
//     },
// });

// export const upload = multer({
//     storage: storage,
//     // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });

import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import ApiError from "./ApiError";
import httpStatus from "http-status";

const fileUploadHandler = (UPLOADS_FOLDER: string) => {
	console.log("inside fileUploadHandler", UPLOADS_FOLDER);
	// Ensure the upload folder exists
	const ensureFolder = async () => {
		try {
			await fs.mkdir(`${UPLOADS_FOLDER}`, { recursive: true });
		} catch (err) {
			console.error(`Failed to create upload folder: ${err}`);
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Failed to create upload folder"
			);
		}
	};

	ensureFolder();

	// Configure multer storage
	const storage: StorageEngine = multer.diskStorage({
		destination: (req, file, cb) => {
			console.log("inside storage", `${UPLOADS_FOLDER}`);
			cb(null, `${UPLOADS_FOLDER}`); // Use the provided destination folder
		},
		filename: (req, file, cb) => {
			// const fileExt = path.extname(file.originalname);
			
			const filename = file.originalname; // Use UUID for unique filename
			cb(null, filename);
		},
	});

	// File filter to allow only specific file types
	const fileFilter = (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback
	) => {
		const allowedTypes = [
			"image/jpg",
			"image/jpeg",
			"image/png",
			"image/gif",
			"application/pdf",
			"image/webp",
			"image/heic",
			"image/heif",
			"text/csv",
			"video/mp4",
			"audio/mpeg",
		];

		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true); // Accept file
		} else {
			console.error(`File rejected: ${file.originalname}`);
			cb(
				new Error(
					"Only jpg, jpeg, png, gif, webp, heic, heif, csv, mp4, pdf and mpeg formats are allowed!"
				)
			);
		}
	};

	// Create and return the upload middleware
	return multer({
		storage,
		limits: {
			fileSize: 100 * 1024 * 1024, // 100MB limit
		},
		fileFilter,
	});
};
export default fileUploadHandler;

