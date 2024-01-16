import { RestConfig, getRouter } from '.';
import { Server } from '../src/server';
import { Container } from '../core';
import { error404Handler } from './middleware';
import { ApiMessage } from '.';

/**
 * mounts rest API handler to server
 * @param server server on which to attach API
 * @param core core services container needed by the rest handler
 * @param config config
 */
export const mountApi = (server: Server, core: Container, config: RestConfig) => {
    const router = getRouter(core);
    server.use(config.apiRoot, router);
    server.use(() => error404Handler(ApiMessage.ERROR_RESOURCE_NOT_FOUND));
};