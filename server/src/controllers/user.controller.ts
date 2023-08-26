import jsonwebtoken from "jsonwebtoken";
import { userModel } from "@/models";
import { Request, Response } from "express";
import { responseHandler } from "@/handlers";

const signUp = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    responseHandler.error(res);
  }
};
