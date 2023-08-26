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

export type SignUpBody = {
  username?: string;
  email?: string;
  password?: string;
};

export type SignInBody = {
  email?: string;
  password?: string;
};
