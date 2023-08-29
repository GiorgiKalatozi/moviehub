/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import env from "../utils/validate-env";

class CustomError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

// Error handling middleware
export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(400).json({ error: err.message });
  }

  const statusCode = (err as CustomError).status || 500;

  const errorResponse = {
    statusCode,
    error: err.name,
    message: err.message || "Something went wrong.",
    stack: env.NODE_ENV === "development" ? err.stack : {},
  };

  return res.status(statusCode).json(errorResponse);
}
