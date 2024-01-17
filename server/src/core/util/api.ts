import axios, { AxiosRequestConfig } from "axios";
import { CoreError, ErrorCode, RapidApiRequestOptions } from "..";

export const createRapidApiRequest = async (opts: RapidApiRequestOptions) => {
  const { API_KEY, API_HOST, method, url, params, data } = opts;
  const options: AxiosRequestConfig = {
    method,
    url,
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
    params,
    data,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new CoreError(error.message, ErrorCode.RAPIDAPI_ERROR);
  }
};
