import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { CoreError, ErrorCode } from "../error";
import { CoreMessage } from "../messages";

/**
 * generates random unique url safe string
 * @return random unique string
 */
export const generateId = (): string => {
  // base64-URL encoding: https://base64.guru/standards/base64url
  return randomBytes(16)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

/**
 * checks whether the specified string is a valid mongodb id
 * @param id string to check
 */
export const isId = (id: string): boolean => {
  return typeof id === "string" && id !== "" && ObjectId.isValid(id);
};

/**
 * checks whether if provided arg is a valid id
 * and throws an error if it's not
 * @param id id to verify
 * @throws CoreError
 */
export const validateId = (id: string) => {
  // for security reasons: to avoid users injecting arbitrary queries
  if (typeof id !== "string" || !isId(id))
    throw new CoreError(
      CoreMessage.ERROR_DB_ID_INVALID,
      ErrorCode.VALIDATION_ERROR
    );
};

// NOTE: this idGenerator object wraps the id generation function
// for easier mocking during testing.
// initially we would use import * as util from './util', then mock util.generateId
// but this no longer worked since updating jest 26.x and ts-jest, due to esm build support

export const idGenerator = {
  generateId,
};

export const idValidator = {
  validateId,
};
