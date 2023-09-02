import { ITEM_REMOVED } from "../constants";
import { responseHandler } from "../handlers";
import FavoriteModel from "../models/favorite.model";
import { AuthUserRequest } from "../types";
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

const removeFavorite = async (
  req: AuthUserRequest & {
    params: {
      favoriteId: string;
    };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await FavoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId,
    });

    if (!favorite) return responseHandler.notFound(res);

    await favorite.deleteOne();

    return responseHandler.ok(res, ITEM_REMOVED);
  } catch (error) {
    next(error);
  }
};

const getFavoritesOfUser = async (
  req: AuthUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const favorite = await FavoriteModel.find({ user: req.user.id }).sort(
      "-createdAt"
    );

    return responseHandler.ok(res, favorite);
  } catch (error) {
    next(error);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };
