import { responseHandler } from "../handlers";
import { tmdbApi } from "../tmdb";
import { RequestHandler } from "express";

const personDetails: RequestHandler<{ personId: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { personId } = req.params;
    const person = await tmdbApi.personDetail({ personId });

    return responseHandler.ok(res, person);
  } catch (error) {
    next(error);
  }
};

const personMedias: RequestHandler<{ personId: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { personId } = req.params;

    const medias = await tmdbApi.personMedias({ personId });

    return responseHandler.ok(res, medias);
  } catch (error) {
    next(error);
  }
};

export default { personDetails, personMedias };
