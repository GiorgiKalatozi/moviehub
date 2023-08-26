import { RequestHandler } from "express";
import { responseHandler } from "@/handlers";
import jsonwebtoken from "jsonwebtoken";
import { EMAIL_TAKEN, FIELDS_MISSING, USERNAME_TAKEN } from "@/constants";
import { UserModel } from "@/models";
import { SignUpBody } from "@/types";
import env from "@/utils/validate-env";
import bcrypt from "bcrypt";

const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return responseHandler.badRequest(res, FIELDS_MISSING);

    const checkUsername = await UserModel.findOne({ username });

    if (checkUsername) return responseHandler.badRequest(res, USERNAME_TAKEN);

    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) return responseHandler.badRequest(res, EMAIL_TAKEN);

    const passwordHashed = bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });

    await newUser.save();

    const token = jsonwebtoken.sign({ data: newUser.id }, env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    return responseHandler.created(res, {
      token,
      ...newUser.toJSON(),
      id: newUser.id,
    });
  } catch (error) {
    next(error);
  }
};
