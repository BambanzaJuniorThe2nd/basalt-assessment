import { IMDBDoc, IMDBRepoOpts, IMDBRepository } from "../types";
import { ManagesDbs, CoreError, ErrorCode, CoreMessage as messages } from "..";
import { createRapidApiRequest } from "../util";
import { Db, Collection, ObjectId } from "mongodb";

const COLLECTION = "imdbDocs";
export class IMDBService implements IMDBRepository {
  readonly dbManager: ManagesDbs;
  readonly db: Db;
  readonly collection: Collection<IMDBDoc>;
  readonly IMDB_API__URL: string;
  readonly IMDB_API__HEADERS_KEY: string;
  readonly IMDB_API__HEADERS_HOST: string;
  private _indexesCreated: boolean;

  constructor(dbManager: ManagesDbs, opts: IMDBRepoOpts) {
    this.dbManager = dbManager;
    this.db = dbManager.mainDb();
    this.collection = this.db.collection(COLLECTION);
    this.IMDB_API__URL = opts.IMDB_API__URL;
    this.IMDB_API__HEADERS_KEY = opts.IMDB_API__HEADERS_KEY;
    this.IMDB_API__HEADERS_HOST = opts.IMDB_API__HEADERS_HOST;
    this._indexesCreated = false;
  }

  /**
   * Checks if the database indexes have been created for this collection.
   *
   * @returns {boolean} True if the indexes have been created, false otherwise.
   */
  get indexesCreated(): boolean {
    return this._indexesCreated;
  }

  /**
   * Checks if the database indexes have been created for this collection,
   * and creates them if they do not exist.
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
   * Retrieves all IMDB document entries from the database.
   */
  async getAll(): Promise<IMDBDoc[]> {
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
   * Retrieves an IMDB document entry by its MongoDB ID.
   */
  async getById(id: string): Promise<IMDBDoc> {
    try {
      const entry = await this.collection.findOne<IMDBDoc>({
        _id: new ObjectId(id),
      });
      if (!entry) {
        throw new CoreError(
          messages.ERROR_IMDB_DOC_NOT_FOUND,
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
   * Retrieves an IMDB document entry by its IMDB ID.
   */
  async getByIMDBId(imdbId: string): Promise<IMDBDoc> {
    try {
      const entry = await this.collection.findOne<IMDBDoc>({ imdbId });
      if (!entry) {
        throw new CoreError(
          messages.ERROR_IMDB_DOC_NOT_FOUND,
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
   * Retrieves an IMDB document entry by searching for a title match.
   * Performs case-insensitive search on the title with whitespace removed.
   * If no match is found, calls the IMDB API to retrieve data for the title.
   * Inserts the retrieved data into the database if found via the API.
   * Throws an error if no match is found in the database or via the API.
   */
  async getByTitle(title: string): Promise<IMDBDoc> {
    try {
      const cleanedTitle = title.replace(/\s+/g, " ").trim().toLowerCase();
      const query = {
        title: {
          $regex: new RegExp(cleanedTitle),
          $options: "i",
        },
      };
      let entry = await this.collection.findOne<IMDBDoc>(query);

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
            messages.ERROR_IMDB_DOC_NOT_FOUND,
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
            messages.ERROR_IMDB_DOC_INSERT_FAILED,
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
