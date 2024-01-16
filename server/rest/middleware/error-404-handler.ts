import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from "..";
import { sendErrorResponse } from "../util";

/**
 * middleware to handle error 404 - not found
 */
export const error404Handler =
  (message: string) =>
  (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    return sendErrorResponse(res, StatusCode.NOT_FOUND, message);
  };
