import express, { RequestHandler } from "express";
import { body } from "express-validator";
import { favoriteController, userController } from "@/controllers";
import { requestHandler, responseHandler } from "@/handlers";
import { UserModel } from "@/models";
import { tokenMiddleware } from "@/middlewares";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 8 })
    .withMessage("username minimum 8 characters")
    .custom(async (value) => {
      const user = await UserModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");
      return true;
    }),
  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter a valid email"),
  requestHandler.validate,
  userController.signUp
);

router.post(
  "/signin",
  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter a valid email"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  requestHandler.validate,
  userController.signIn
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  body("newPassword")
    .exists()
    .withMessage("newPassword is required")
    .isLength({ min: 8 })
    .withMessage("newPassword minimum 8 characters"),
  body("confirmNewPassword")
    .exists()
    .withMessage("confirmNewPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmNewPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("confirmNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword as any
);

router.get("/info", tokenMiddleware.auth, userController.getInfo as any);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser as any
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediatype")
    .exists()
    .withMessage("mediatype is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("mediatype is invalid"),
  body("mediaId")
    .exists()
    .withMessage("mediaId is required")
    .isLength({ min: 1 })
    .withMessage("mediaId can not be empty"),
  body("mediaTitle").exists().withMessage("mediaTitle is required"),
  body("mediaPoster").exists().withMessage("mediaPoster is required"),
  body("mediaRate").exists().withMessage("mediaRate is required"),
  favoriteController.addFavorite as any
);
