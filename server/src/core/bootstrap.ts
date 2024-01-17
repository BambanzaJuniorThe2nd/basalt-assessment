import { CoreConfig, Container } from "./types";
import { DbManager } from "./db-manager";
import { IMDBDocs } from './imdb';
import { YoutubeDocs } from './youtube';

export const bootstrap = async (config: CoreConfig): Promise<Container> => {
  // init db
  const dbManager = new DbManager(config.dbUrl, {
    prefix: config.dbPrefix,
    mainDb: config.dbMain,
  });
  await dbManager.initialize();

  // init imdb entries
  const imdbEntries = new IMDBDocs(dbManager, {
    IMDB_API__URL: config.IMDB_API__URL,
    IMDB_API__HEADERS_KEY: config.IMDB_API__HEADERS_KEY,
    IMDB_API__HEADERS_HOST: config.IMDB_API__HEADERS_HOST,
  });
  await imdbEntries.createIndexes();

  // init ytbVideos
  const ytbVideos = new YoutubeDocs(dbManager, {
    YOUTUBE_API__URL: config.YOUTUBE_API__URL,
    YOUTUBE_API__HEADERS_KEY: config.YOUTUBE_API__HEADERS_KEY,
    YOUTUBE_API__HEADERS_HOST: config.YOUTUBE_API__HEADERS_HOST,
  });
  await ytbVideos.createIndexes();

  return Object.freeze({
    dbManager,
  });
};
