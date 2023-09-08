import { NextFunction, Request, Response } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { responseHandler } from "../handlers";
import env from "../utils/validate-env";
import UserModel, { User } from "../models/user.model";

interface DecodedToken extends JwtPayload {
  data: string;
}

interface AuthRequest extends Request {
  user: User;
}

const tokenDecode = (req: Request) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      if (token) {
        return jsonwebtoken.verify(token, env.TOKEN_SECRET) as DecodedToken;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) return responseHandler.unauthorized(res);

  const user = await UserModel.findById(tokenDecoded.data);

  if (!user) return responseHandler.unauthorized(res);

  (req as AuthRequest).user = user;

  next();
};

export { isAuth, tokenDecode };
