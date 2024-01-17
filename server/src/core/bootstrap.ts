import { CoreConfig, Container } from "./types";
import { DbManager } from "./db-manager";
import { IMDBService } from "./imdb";
import { YoutubeService } from "./youtube";
import { AggregatorService } from "./aggregator";

export const bootstrap = async (config: CoreConfig): Promise<Container> => {
  // init db
  const dbManager = new DbManager(config.dbUrl, {
    prefix: config.dbPrefix,
    mainDb: config.dbMain,
  });
  await dbManager.initialize();

  // init imdb service
  const imdbService = new IMDBService(dbManager, {
    IMDB_API__URL: config.IMDB_API__URL,
    IMDB_API__HEADERS_KEY: config.IMDB_API__HEADERS_KEY,
    IMDB_API__HEADERS_HOST: config.IMDB_API__HEADERS_HOST,
  });
  await imdbService.createIndexes();

  // init youtube service
  const youtubeService = new YoutubeService(dbManager, {
    YOUTUBE_API__URL: config.YOUTUBE_API__URL,
    YOUTUBE_API__HEADERS_KEY: config.YOUTUBE_API__HEADERS_KEY,
    YOUTUBE_API__HEADERS_HOST: config.YOUTUBE_API__HEADERS_HOST,
  });
  await youtubeService.createIndexes();

  // init aggregator service
  const aggregatorService = new AggregatorService(dbManager, {
    imdbService,
    youtubeService,
  });
  await aggregatorService.createIndexes();

  return Object.freeze({
    aggregatorService,
  });
};
