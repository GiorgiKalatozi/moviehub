import { Request, Response, NextFunction } from "express";

// Error handling middleware for undefined routes (404 Not Found)
export default function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new Error("Page Not Found");

  res.status(404).json({
    message: `This page doesn’t seem to exist.`,
    error: error.message,
  });
  next(error);
}
