import axios from "axios";

const get = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export default { get };
