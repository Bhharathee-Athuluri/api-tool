import axios from "axios";

export const GET = async (URL, body, headers) => {
  const res = await axios.get(URL, {}, {});
  return res;
};
