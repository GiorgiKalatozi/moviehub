import axios from "axios";

const get = async (url: string): Promise<unknown> => {
  const response = await axios.get(url);
  return response.data;
};

export default { get };
