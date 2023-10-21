import axios from "axios";

export const POST = async (URL, body, headers) => {
  const res = await axios.post(URL, body, { headers: { headers } });
  return res;
};
