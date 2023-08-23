import tmdbConfig from "./tmdb.config";

type MediaList = {
  mediaType: string;
  mediaCategory: string;
  page: string;
};

type MediaType = {
  mediaType: string;
  mediaId: string;
};

type MediaSearch = {
  mediaType: string;
  query: string;
  page: string;
};

const tmdbEndpoints = {
  mediaList: ({ mediaType, mediaCategory, page }: MediaList) =>
    tmdbConfig.getUrl(`${mediaType}/${mediaCategory}`, page),
  mediaDetail: ({ mediaType, mediaId }: MediaType) =>
    tmdbConfig.getUrl(`${mediaType}/${mediaId}`),
  mediaGenres: ({ mediaType }: MediaType) =>
    tmdbConfig.getUrl(`genre/${mediaType}/list`),
  mediaCredits: ({ mediaType, mediaId }: MediaType) =>
    tmdbConfig.getUrl(`${mediaType}/${mediaId}/credits`),
  mediaVideos: ({ mediaType, mediaId }: MediaType) =>
    tmdbConfig.getUrl(`${mediaType}/${mediaId}/videos`),
  mediaRecommend: ({ mediaType, mediaId }: MediaType) =>
    tmdbConfig.getUrl(`${mediaType}/${mediaId}/recommendations`),
  mediaImages: ({ mediaType, mediaId }: MediaType) =>
    tmdbConfig.getUrl(`${mediaType}/${mediaId}/images`),
  mediaSearch: ({ mediaType, query, page }: MediaSearch) =>
    tmdbConfig.getUrl(`search/${mediaType}`, { query, page }),
  personDetail: ({ personId }: { personId: string }) =>
    tmdbConfig.getUrl(`person/${personId}`),
  personMedias: ({ personId }: { personId: string }) =>
    tmdbConfig.getUrl(`person/${personId}/combined_credits`),
};

export default tmdbEndpoints;
