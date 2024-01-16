import { ApiRequest, ApiResponse, ApiNextFunction } from "../types";
import { Container } from "../../core";

/**
 * injects the specified core container to all
 * request objects
 * @param core core services container
 */
export const injectCore =
  (core: Container) =>
  (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    req.core = core;
    next();
  };
