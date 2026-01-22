import { NextFunction, Request, Response } from "express";
import { config } from "../config";

const ExtractFilePaths = (req: Request, _res: Response, next: NextFunction) => {
	const urls = (req.files as Express.Multer.File[]).map(
		(file) => `${config.base_url}/${file.path}`
	);

	if (urls.length > 0) {
		req.body.urls = urls;
	}
	next();
};

export default ExtractFilePaths;
