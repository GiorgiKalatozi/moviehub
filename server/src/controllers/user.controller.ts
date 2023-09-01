import { NextFunction, RequestHandler, Response } from "express";
import { responseHandler } from "../handlers";
import jsonwebtoken from "jsonwebtoken";
import {
  EMAIL_TAKEN,
  FIELDS_MISSING,
  INVALID_EMAIL_ADDRESS,
  INVALID_PASSWORD,
  PASSWORDS_DO_NOT_MATCH,
  PASSWORD_UPDATED,
  USERNAME_TAKEN,
  USER_NOT_FOUND,
} from "../constants";
import { UserModel } from "../models";
import {
  AuthUserRequest,
  SignInBody,
  SignUpBody,
  UpdatePasswordBody,
} from "../types";
import env from "../utils/validate-env";
import bcrypt from "bcrypt";
import { UserService } from "../services";
import { isValidEmail } from "../utils/validators";

const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return responseHandler.badRequest(res, FIELDS_MISSING);
    }

    if (!isValidEmail(email)) {
      return responseHandler.badRequest(res, INVALID_EMAIL_ADDRESS);
    }

    if (password !== confirmPassword) {
      return responseHandler.badRequest(res, PASSWORDS_DO_NOT_MATCH);
    }

    const isUsernameAvailable = await UserService.isUsernameAvailable(username);

    if (!isUsernameAvailable) {
      return responseHandler.badRequest(res, USERNAME_TAKEN);
    }

    const isEmailAvailable = await UserService.isEmailAvailable(email);

    if (!isEmailAvailable) {
      return responseHandler.badRequest(res, EMAIL_TAKEN);
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

    return responseHandler.created(res, {
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

    if (!email || !password)
      return responseHandler.badRequest(res, FIELDS_MISSING);

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
