import { ApiResponse, ApiMessage, StatusCode } from '..';

/**
 * creates an error response body
 * @param message error message
 */
export const createErrorResponse = (message: string) => {
    return {
        message: message
    };
};

/**
 * creates a default server error response body
 */
export const createServerError = () => {
    return createErrorResponse(ApiMessage.ERROR_SERVER);
};

/**
 * sends an error response
 * @param res response object
 * @param status HTTP status code
 * @param message error message
 */
export const sendErrorResponse = (res: ApiResponse, status: number, message: string) => {
    return res.status(status).send(createErrorResponse(message));
};

/**
 * sends a server error response (status 500)
 * @param res response object
 */
export const sendServerError = (res: ApiResponse) => {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).send(createServerError());
};
