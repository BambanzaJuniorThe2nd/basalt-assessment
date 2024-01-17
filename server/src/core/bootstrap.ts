import { CoreConfig, Container } from "./types";
import { DbManager } from "./db-manager";
import { IMDBEntries } from './imdb';

export const bootstrap = async (config: CoreConfig): Promise<Container> => {
  // init db
  const dbManager = new DbManager(config.dbUrl, {
    prefix: config.dbPrefix,
    mainDb: config.dbMain,
  });
  await dbManager.initialize();

  // init imdb entries
  const imdbEntries = new IMDBEntries(dbManager, {
    IMDB_API__URL: config.IMDB_API__URL,
    IMDB_API__HEADERS_KEY: config.IMDB_API__HEADERS_KEY,
    IMDB_API__HEADERS_HOST: config.IMDB_API__HEADERS_HOST,
  });
  await imdbEntries.createIndexes();

  return Object.freeze({
    dbManager,
  });
};
