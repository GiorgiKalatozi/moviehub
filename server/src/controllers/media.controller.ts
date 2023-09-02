/* eslint-disable @typescript-eslint/no-explicit-any */
import { responseHandler } from "../handlers";
import { RequestHandler } from "express";
import { FIELDS_MISSING } from "../constants";
import { tokenMiddleware } from "../middlewares";
import tmdbApi from "../tmdb/tmdb.api";
import UserModel from "../models/user.model";
import FavoriteModel from "../models/favorite.model";
import ReviewModel from "../models/review.model";

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

    const mediaList = await tmdbApi.mediaList({
      mediaType,
      mediaCategory,
      page,
    });

    return responseHandler.ok(res, mediaList);
  } catch (error) {
    next(error);
  }
};

const getGenres: RequestHandler<
  { mediaType: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { mediaType } = req.params;

    const mediaGenres = await tmdbApi.mediaGenres({ mediaType });

    return responseHandler.ok(res, mediaGenres);
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

    const mediaSearch = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType,
    });

    return responseHandler.ok(res, mediaSearch);
  } catch (error) {
    next(error);
  }
};

const getDetail: RequestHandler<{
  mediaType: string;
  mediaId: string;
}> = async (req, res, next) => {
  try {
    const { mediaId, mediaType } = req.params;

    const params = { mediaId, mediaType };

    const media: any = await tmdbApi.mediaDetail(params);

    media.credits = await tmdbApi.mediaCredits(params);

    const videos = await tmdbApi.mediaVideos(params);

    media.videos = videos;

    const recommend: any = await tmdbApi.mediaRecommend(params);

    media.recommend = recommend.results;

    media.images = await tmdbApi.mediaImages(params);

    const tokenDecoded = tokenMiddleware.tokenDecode(req);

    if (tokenDecoded) {
      const user = await UserModel.findById(tokenDecoded.data);

      if (user) {
        const isFavorite = await FavoriteModel.findOne({
          user: user.id,
          mediaId,
        });
        media.isFavorite = isFavorite !== null;
      }
    }

    media.reviews = await ReviewModel.find({ mediaId })
      .populate("user")
      .sort("-createdAt");

    return responseHandler.ok(res, media);
  } catch (error) {
    next(error);
  }
};

export default { getList, getGenres, search, getDetail };
