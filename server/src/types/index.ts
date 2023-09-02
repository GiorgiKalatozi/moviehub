import { User } from "../models/user.model";

export type AuthUser = {
  user: User & { id: string };
};

export type AuthUserRequest = Request & AuthUser;

export type MediaList = {
  mediaType: string;
  mediaCategory: string;
  page: string;
};

export type MediaType = {
  mediaType: string;
  mediaId?: string;
};

export type MediaSearch = {
  mediaType: string;
  query: string;
  page: string;
};

export type SignInBody = {
  email: string;
  password: string;
};

export type UpdatePasswordBody = {
  body: {
    password?: string;
    newPassword?: string;
  };
};
