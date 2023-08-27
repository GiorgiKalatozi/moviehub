import { responseHandler } from "@/handlers";
import { tmdbApi } from "@/tmdb";
import { FavoriteModel, UserModel, ReviewModel } from "@/models";
import { RequestHandler } from "express";
import { FIELDS_MISSING } from "@/constants";

const getList: RequestHandler<
  { mediaType: string; mediaCategory: string },
  unknown,
  unknown,
  { page: string }
> = async (req, res, next) => {
  try {
    const { page } = req.query;

    if (!page) return responseHandler.badRequest(res, FIELDS_MISSING);

    const { mediaType, mediaCategory } = req.params;

    if (!mediaType || !mediaCategory)
      return responseHandler.badRequest(res, FIELDS_MISSING);

    const response = await tmdbApi.mediaList({
      mediaType,
      mediaCategory,
      page,
    });

    return responseHandler.ok(res, response);
  } catch (error) {
    next(error);
  }
};
