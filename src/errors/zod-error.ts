import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../types/error";

export const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const message = "Zod validation error";

  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    const path = issue?.path?.join('.') || 'unknown'; 

    let customMessage = issue.message;

    if (issue.code === "invalid_type" && issue.received === "undefined") {
      customMessage = `${path} is required.`;
    }

    return {
      path,
      message: customMessage,
    };
  });

  return {
    statusCode,
    message,
    errorSources,
  };
};
