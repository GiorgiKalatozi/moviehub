/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { body } from "express-validator";
import { requestHandler } from "../handlers";
import { validate } from "../middlewares/validate.middleware";
import { signUpSchema } from "../schemas/user.schema";
import userController from "../controllers/user.controller";
import favoriteController from "../controllers/favorite.controller";
import tokenMiddleware from "../middlewares/token.middleware";

const router = express.Router();

router.post("/signup", validate(signUpSchema), userController.signUp);

router.post(
  "/signin",
  [
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
  ],
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

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite as any
);

export default router;
