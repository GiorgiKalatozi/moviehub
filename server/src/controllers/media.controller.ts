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

const getGenres: RequestHandler<{ mediaType: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaGenres({ mediaType });

    return responseHandler.ok(res, response);
  } catch (error) {
    next(error);
  }
};

const search: RequestHandler<
  { mediaType: string },
  unknown,
  unknown,
  { query: string; page: string }
> = async (req, res, next) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType,
    });

    return responseHandler.ok(res, response);
  } catch (error) {
    next(error);
  }
};
