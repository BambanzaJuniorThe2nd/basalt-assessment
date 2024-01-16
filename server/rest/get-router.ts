import { Router } from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { root } from './routes';
import { injectCore, errorHandler, error404Handler } from './middleware';
import { Container } from '../core';
import { ApiMessage } from '.';

/**
 * returns a router than handles
 * all API routes
 * @param core core services
 */
export const getRouter = (core: Container) => {
  const router = Router();
  router.use(bodyParser.json());
  router.use(cors());
  router.use(() => injectCore(core));

  router.use("/", root);

  router.use(() => errorHandler());
  router.use(() => error404Handler(ApiMessage.ERROR_ENDPOINT_DOES_NOT_EXIST));

  return router;
};
