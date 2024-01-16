import * as express from 'express';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { ServerConfig, Server } from './types';

/**
 * creates a server instance
 */
export const createServer = (): Server => {
    const server = express();
    server.use(helmet());
    server.use(morgan(':method :url :status :res[content-length] bytes - :response-time ms'));
    return server;
};

/**
 * starts the specified server on the configured port
 * @param server server to start
 * @param config server config
 */
export const startServer = async (server: Server, config: ServerConfig) => {
    return new Promise((resolve, reject) => {
        const serverStarted = server.listen(config.port, () => {});
        return resolve(serverStarted);
    });
};