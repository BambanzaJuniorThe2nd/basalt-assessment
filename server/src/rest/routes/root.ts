import { Router } from "express";
import { ApiRequest, ApiResponse, StatusCode } from "..";

export const root = Router();

root.get("/", (req: ApiRequest, res: ApiResponse) => {
  res.status(StatusCode.SUCCESS).json({ ok: true });
});
