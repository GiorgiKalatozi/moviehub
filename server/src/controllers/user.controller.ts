import { NextFunction, RequestHandler, Response } from "express";
import { responseHandler } from "../handlers";
import jsonwebtoken from "jsonwebtoken";
import {
  FIELDS_MISSING,
  INVALID_PASSWORD,
  PASSWORD_UPDATED,
  USER_NOT_FOUND,
} from "../constants";
import {
  AuthUserRequest,
  SignInBody,
  SignUpBody,
  UpdatePasswordBody,
} from "../types";
import env from "../utils/validate-env";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { UserService } from "../services/user.service";
import UserModel from "../models/user.model";

const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const { username, email, password } = req.body;

    const isUsernameAvailable = await UserService.isUsernameAvailable(username);

    if (!isUsernameAvailable) {
      throw createHttpError(400, "Username is already taken");
    }

    const isEmailAvailable = await UserService.isEmailAvailable(email);

    if (!isEmailAvailable) {
      throw createHttpError(400, "Email is already in use");
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const newUser = await UserService.createUser(
      username,
      email,
      passwordHashed
    );

    const token = jsonwebtoken.sign({ data: newUser.id }, env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      token,
      ...newUser.toJSON(),
      id: newUser.id,
    });
  } catch (error) {
    next(error);
  }
};

const signIn: RequestHandler<unknown, unknown, SignInBody, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select(
      "username password email id"
    );

    if (!user) return responseHandler.badRequest(res, USER_NOT_FOUND);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return responseHandler.badRequest(res, INVALID_PASSWORD);
    }

    const token = jsonwebtoken.sign(
      {
        data: user.id,
      },
      env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    return responseHandler.created(res, {
      token,
      ...user.toJSON(),
      id: user.id,
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (
  req: AuthUserRequest & UpdatePasswordBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, newPassword } = req.body;

    if (!password || !newPassword)
      return responseHandler.badRequest(res, FIELDS_MISSING);

    const user = await UserModel.findById(req.user.id).select("password id");

    if (!user) return responseHandler.unauthorized(res);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return responseHandler.badRequest(res, INVALID_PASSWORD);
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHashed;
    await user.save();

    return responseHandler.ok(res, PASSWORD_UPDATED);
  } catch (error) {
    next(error);
  }
};

const getInfo = async (
  req: AuthUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) return responseHandler.notFound(res);

    return responseHandler.ok(res, user);
  } catch (error) {
    next(error);
  }
};

export default {
  signUp,
  signIn,
  getInfo,
  updatePassword,
};
