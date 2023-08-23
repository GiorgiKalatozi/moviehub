import env from "../utils/validate-env";

const baseUrl = env.TMDB_BASE_URL;
const key = env.TMDB_KEY;

const getUrl = (endpoint: string, params: string) => {
  const querySearch = new URLSearchParams(params);

  return `${baseUrl}${endpoint}?api_key=${key}&${querySearch}`;
};

export default { getUrl };
