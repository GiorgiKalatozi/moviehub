import { responseHandler } from "@/handlers";
import { FavoriteModel } from "@/models";
import { AuthUserRequest } from "@/types";
import { NextFunction, Response } from "express";

const addFavorite = async (
  req: AuthUserRequest & {
    body: {
      mediaId: string;
    };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const isFavorite = await FavoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId,
    });

    if (isFavorite) return responseHandler.ok(res, isFavorite);

    const favorite = new FavoriteModel({
      ...req.body,
      user: req.user.id,
    });

    await favorite.save();

    return responseHandler.created(res, favorite);
  } catch (error) {
    next(error);
  }
};
