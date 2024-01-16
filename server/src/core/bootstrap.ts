import { CoreConfig, Container } from "./types";
import { DbManager } from "./db-manager";

export const bootstrap = async (config: CoreConfig): Promise<Container> => {
  // init db
  const dbManager = new DbManager(config.dbUrl, {
    prefix: config.dbPrefix,
    mainDb: config.dbMain,
  });
  await dbManager.initialize();

  return Object.freeze({
    dbManager,
  });
};
