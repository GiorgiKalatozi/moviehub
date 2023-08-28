import express from "express";
import { body } from "express-validator";
import { favoriteController, userController } from "@/controllers";
import { requestHandler, responseHandler } from "@/handlers";
import { UserModel } from "@/models";
import { tokenMiddleware } from "@/middlewares";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .isLength({ min: 0 })
    .withMessage("username minimum 8 characters")
    .custom(async (value) => {
      const user = await UserModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .isLength({ min: 0 })
    .withMessage("password minimum 8 characters"),
  body("confirmPassword")
    .isLength({ min: 0 })
    .withMessage("confirm password minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");
      return true;
    }),
  body("email").isEmail().withMessage("enter a valid email"),
  requestHandler.validate,
  userController.signUp
);

router.post(
  "/signin",
  body("email").isEmail().withMessage("enter a valid email"),
  body("password")
    .isLength({ min: 0 })
    .withMessage("password minimum 8 characters"),
  requestHandler.validate,
  userController.signIn
);
