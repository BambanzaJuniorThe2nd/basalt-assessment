import { Router } from "express";
import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from "..";
import { compressAndCache, getFromCache, getAllFromCache } from "../middleware";

export const aggregators = Router();

aggregators.get(
  "/all",
  getAllFromCache,
  (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    req.core.aggregatorService
      .getAll()
      .then((aggregatedData) =>
        res.status(StatusCode.SUCCESS).send(aggregatedData)
      )
      .catch(next);
  }
);

aggregators.get(
  "/:id",
  getFromCache, // Check cache middleware
  async (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const aggregatorId = req.params.id;

    try {
      // If checkCache middleware didn't send a response, proceed to fetch from service
      const aggregatedData = await req.core.aggregatorService.getById(
        aggregatorId
      );

      // Set key for caching
      res.locals.key = aggregatorId;
      res.locals.result = aggregatedData;
      next();
    } catch (e) {
      next(e);
    }
  },
  compressAndCache // Compress and cache middleware
);

aggregators.post(
  "/search",
  async (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const { term } = req.body;
    req.core.aggregatorService
      .getBySearchTerm(term)
      .then((result) => {
        // Set key for caching
        res.locals.key = result._id.toString();
        res.locals.result = result;
        next();
      })
      .catch(next);
  },
  compressAndCache
);
