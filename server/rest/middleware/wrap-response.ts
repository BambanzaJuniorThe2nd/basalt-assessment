import { ApiRequest, ApiResponse, ApiNextFunction } from "../types";

interface Handler {
  (req: ApiRequest): Promise<any>;
}

/**
 * this middleware calls the specified handler function and sends its return value
 * as the API response. It also sends errors from the function to the API error handler.
 *
 * this middleware was created to make it easier to write most handler functions, since
 * they happened to follow a common pattern
 *
 * @example
 * // the following code
 * router.get('endpoint/:id', (req, res, next) => {
 *   getById(req.params.id)
 *      .then(data => res.status(200).send(data))
 *      .catch(next);
 * });
 *
 * // can be rewritten as follows using this wrapResponse
 * router.get('endpoint/:id', wrapResponse((req) => getById(req.params.id)));
 *
 * @param handler
 * @param statusCode status code to send on success
 */
export function wrapResponse(handler: Handler, statusCode = 200) {
  return (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) =>
    handler(req)
      .then((result) => res.status(statusCode).send(result))
      .catch(next);
}
