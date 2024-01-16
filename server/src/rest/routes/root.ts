import { Router } from "express";
import { ApiRequest, ApiResponse, StatusCode } from "..";

export const root = Router();

root.get("/", (res: ApiResponse) => {
  res.status(StatusCode.SUCCESS).json({ ok: true });
});
