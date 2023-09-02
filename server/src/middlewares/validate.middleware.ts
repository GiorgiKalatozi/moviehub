/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  (schema: z.AnyZodObject | z.ZodType<any, any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse(req.body);
      next();
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
      }
      return res.status(409).json({
        status: "failed",
        error: err,
      });
    }
  };
