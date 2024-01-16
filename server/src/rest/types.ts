import { Request, Response, NextFunction } from "express";
import { Container } from "../core";

export interface RestConfig {
  apiRoot: string;
}

export interface ApiRequest extends Request {
  core: Container;
}

export interface ApiResponse extends Response {}

export interface ApiNextFunction extends NextFunction {}
