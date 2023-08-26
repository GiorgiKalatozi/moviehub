import { axiosClient } from "axios";

const get = async (url: string): Promise<any> => {
  const response = await axiosClient.get(url);
  return response.data;
};

export default { get };
