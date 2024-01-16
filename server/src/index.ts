import { createLogger, transports } from 'winston';
import { bootstrap as bootstrapCore, CoreConfig } from '../core';
import { createServer, startServer, ServerConfig } from './server';
import { mountApi, RestConfig } from './rest';

interface SuperConfig extends CoreConfig, ServerConfig, RestConfig {}

const logger = createLogger({
  transports: [new transports.Console()],
});

const loadConfig = (env: any): SuperConfig => {
  return {
    dbUrl: env.DB_URL || 'mongodb://localhost:27017',
    dbPrefix: env.DB_PREFIX || 'basalt_',
    dbMain: env.DB_MAIN || 'main',
    port: env.PORT || 5000,
    apiRoot: env.API_ROOT || '/api',
    baseUrl: env.BASE_URL || 'http://localhost:5000',
    clientBaseUrl: env.CLIENT_BASE_URL || 'http://localhost:3000',
  };
};

const start = async () => {
  const config = loadConfig(process.env);
  const envMode = process.env.NODE_ENV || 'development';
  try {
    logger.info(`Starting app in ${envMode} mode...`);
    logger.info('Bootstrapping core services...');
    const core = await bootstrapCore(config);
    const expressServer = createServer();
    logger.info('Mounting REST API...');
    mountApi(expressServer, core, config);
    logger.info('REST API mounted on /api');
    await startServer(expressServer, config);
    logger.info('Server started on port: ' + config.port);
    logger.info('App is ready');
  } catch (e) {
    logger.error(
      'Application could not start: CODE',
      e.code,
      'MESSAGE:',
      e.message
    );
    logger.error(e);
    process.exit(1);
  }
};

// start app
start();
