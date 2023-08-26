import { Response } from "express";

const responseWithData = (res: Response, statusCode: number, data: any) =>
  res.status(statusCode).json(data);

const error = (res: Response) =>
  responseWithData(res, 500, {
    status: 500,
    message: "Whoops! Something went wrong!",
  });

const badRequest = (res: Response, message: string) =>
  responseWithData(res, 400, {
    status: 400,
    message,
  });

const ok = (res: Response, data: any) => responseWithData(res, 200, data);

const created = (res: Response, data: any) => responseWithData(res, 201, data);

const unauthorized = (res: Response) =>
  responseWithData(res, 401, {
    status: 401,
    message: "Unauthorized",
  });

const forbidden = (res: Response) =>
  responseWithData(res, 403, {
    status: 403,
    message: "Forbidden",
  });

const notFound = (res: Response) =>
  responseWithData(res, 404, {
    status: 404,
    message: "Resource not found",
  });

export default {
  error,
  badRequest,
  unauthorized,
  forbidden,
  ok,
  created,
  notFound,
};
