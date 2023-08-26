import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  TMDB_BASE_URL: str(),
  TMDB_KEY: str(),
  TOKEN_SECRET: str(),
});
