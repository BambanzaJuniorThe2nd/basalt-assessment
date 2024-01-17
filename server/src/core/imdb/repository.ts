import { IMDBEntry, IMDBEntryOptions, IMDBEntryRepository } from "../types";
import { ManagesDbs, CoreError, ErrorCode, CoreMessage as messages } from "..";
import { createRapidApiRequest } from "../util";
import { Db, Collection, ObjectId } from "mongodb";

const COLLECTION = "imdbEntries";
export class IMDBEntries implements IMDBEntryRepository {
  readonly dbManager: ManagesDbs;
  readonly db: Db;
  readonly collection: Collection<IMDBEntry>;
  readonly IMDB_API__URL: string;
  readonly IMDB_API__HEADERS_KEY: string;
  readonly IMDB_API__HEADERS_HOST: string;
  private _indexesCreated: boolean;

  constructor(dbManager: ManagesDbs, opts: IMDBEntryOptions) {
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

  /**
   * Retrieves all IMDB entries from the database.
   */
  async getAll(): Promise<IMDBEntry[]> {
    try {
      const result = await this.collection.find({});
      return await result.toArray();
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      }
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }

  /**
   * Retrieves an IMDB entry by ID from the database.
   *
   * @param id - The ObjectId of the IMDB entry to retrieve.
   * @returns The IMDB entry document.
   * @throws {CoreError} If no entry is found for the given ID.
   */
  async getById(id: string): Promise<IMDBEntry> {
    try {
      const entry = await this.collection.findOne<IMDBEntry>({
        _id: new ObjectId(id),
      });
      if (!entry) {
        throw new CoreError(
          messages.ERROR_IMDB_ENTRY_NOT_FOUND,
          ErrorCode.DB_OBJECT_NOT_FOUND
        );
      }

      return entry;
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      }
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }

  /**
   * Retrieves an IMDB entry by imdbId from the database.
   *
   * @param imdbId - The imdbId of the IMDB entry to retrieve.
   * @returns The IMDB entry document.
   * @throws {CoreError} If no entry is found for the given imdbId.
   */
  async getByIMDBId(imdbId: string): Promise<IMDBEntry> {
    try {
      const entry = await this.collection.findOne<IMDBEntry>({ imdbId });
      if (!entry) {
        throw new CoreError(
          messages.ERROR_IMDB_ENTRY_NOT_FOUND,
          ErrorCode.DB_OBJECT_NOT_FOUND
        );
      }

      return entry;
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      }
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }

  /**
   * Retrieves an IMDB entry by title from the database.
   *
   * @param title - The title of the IMDB entry to retrieve.
   * @returns The IMDB entry document.
   * @throws {CoreError} If no entry is found for the given title.
   */
  async getByTitle(title: string): Promise<IMDBEntry> {
    try {
      // Remove white spaces from the query parameter and use a case-insensitive regular expression
      const cleanedTitle = title.replace(/\s/g, "");
      const query = { title: { $regex: new RegExp(cleanedTitle, "i") } };
      let entry = await this.collection.findOne<IMDBEntry>(query);
      
      if (!entry) {
        const data = await createRapidApiRequest({
          API_KEY: this.IMDB_API__HEADERS_KEY,
          API_HOST: this.IMDB_API__HEADERS_HOST,
          method: "GET",
          url: this.IMDB_API__URL,
          params: { q: title },
        });
        if (!data || !data.results || data.results.length === 0) {
          throw new CoreError(
            messages.ERROR_IMDB_ENTRY_NOT_FOUND,
            ErrorCode.DB_OBJECT_NOT_FOUND
          );
        }

        const {
          id,
          image,
          runningTimeInMinutes,
          title: t,
          titleType,
          year,
          principals,
        } = data.results[0];

        entry = {
          _id: new ObjectId(),
          imdbId: id,
          image,
          runningTimeInMinutes,
          title: t,
          titleType,
          year,
          principals,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const res = await this.collection.insertOne(entry);
        if (!res.acknowledged) {
          throw new CoreError(
            messages.ERROR_IMDB_ENTRY_INSERT_FAILED,
            ErrorCode.DB_OP_FAILED
          );
        }
      }

      return entry;
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      }
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }
}
