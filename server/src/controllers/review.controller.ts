import { responseHandler } from "../handlers";
import ReviewModel from "../models/review.model";
import { AuthUserRequest } from "../types";
import { NextFunction, Response } from "express";

const create = async (
  req: AuthUserRequest & {
    params: {
      movieId: string;
    };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const { movieId } = req.params;

    const review = new ReviewModel({ user: req.user.id, movieId, ...req.body });

    await review.save();

    return responseHandler.created(res, {
      ...review.toJSON(),
      id: review.id,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (
  req: AuthUserRequest & {
    params: {
      reviewId: string;
    };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findOne({
      _id: reviewId,
      user: req.user.id,
    });

    if (!review) return responseHandler.notFound(res);

    await review.deleteOne();

    return responseHandler.ok(res, review);
  } catch (error) {
    next(error);
  }
};

const getReviewsOfUser = async (
  req: AuthUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await ReviewModel.find({
      user: req.user.id,
    }).sort("-createdAt");

    return responseHandler.ok(res, reviews);
  } catch (error) {
    next(error);
  }
};

export default { create, remove, getReviewsOfUser };
