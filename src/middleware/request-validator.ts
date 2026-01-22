import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";
import asyncHandler from "../utils/asyncHandler";

const requestValidator = (schema: ZodTypeAny): RequestHandler => {
    return asyncHandler(async (req, _res, next) => {
        const validatedData = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
            files: req.files
        });

        req.validatedData = validatedData
        next();
    });
};

export default requestValidator;
