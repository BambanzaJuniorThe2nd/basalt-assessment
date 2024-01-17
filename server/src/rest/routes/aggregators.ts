import { Router } from "express";
import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from "..";

export const aggregators = Router();

aggregators.get(
  "/all",
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
  async (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const aggregatorId = req.params.id;

    try {
      const aggregatedData = await req.core.aggregatorService.getById(
        aggregatorId
      );
      res.status(200).send(aggregatedData);
    } catch (e) {
      next(e);
    }
  }
);

aggregators.post(
  "/search",
  async (req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    const { term } = req.body;
    req.core.aggregatorService
      .getBySearchTerm(term)
      .then((result) => res.status(StatusCode.SUCCESS).send(result))
      .catch(next);
  }
);
