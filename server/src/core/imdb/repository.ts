import { IMDBEntry, IMDBEntryOptions, IMDBEntryRepository } from "../types";
import { ManagesDbs, CoreError, ErrorCode, CoreMessage as messages } from '..';
import { Db, Collection, ObjectId } from 'mongodb';

const COLLECTION = 'imdbEntries';
export class IMDBEntries implements IMDBEntryRepository {
  readonly dbManager: ManagesDbs;
  readonly db: Db;
  readonly collection: Collection<IMDBEntry>;
  readonly IMDB_API__URL: string;
  readonly IMDB_API__HEADERS_KEY: string
  readonly IMDB_API__HEADERS_HOST: string;
  private _indexesCreated: boolean;

  constructor(
    dbManager: ManagesDbs,
    opts: IMDBEntryOptions
  ) {
    this.dbManager = dbManager;
    this.db = dbManager.mainDb();
    this.collection = this.db.collection(COLLECTION);
    this.IMDB_API__URL = opts.IMDB_API__URL;
    this.IMDB_API__HEADERS_KEY = opts.IMDB_API__HEADERS_KEY;
    this.IMDB_API__HEADERS_HOST = opts.IMDB_API__HEADERS_HOST;
    this._indexesCreated = false;
  }

  /**
   * check whether indexes have been created
   * on nfts collection
   */
  get indexesCreated(): boolean {
    return this._indexesCreated;
  }

  /**
   * creates required indexes on
   * nfts collections
   * @throws DB_ERROR
   */
  async createIndexes(): Promise<void> {
    if (this._indexesCreated) return;
    try {
      await this.collection.createIndex({ _id: 1, imdbId: 1, title: 1 }, {});
      this._indexesCreated = true;
    } catch (e) {
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }
}
