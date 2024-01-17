import {
    IMDBRelatedYouTubeVideoDoc,
  IMDBRelatedYouTubeVideosRepository,
  IMDBRelatedYouTubeVideoOptions,
} from "../types";
import { ManagesDbs, CoreError, ErrorCode, CoreMessage as messages } from "..";
import { createRapidApiRequest } from "../util";
import { Db, Collection, ObjectId } from "mongodb";

const COLLECTION = "youtubes";
export class IMDBRelatedYouTubeVideos
  implements IMDBRelatedYouTubeVideosRepository
{
  readonly dbManager: ManagesDbs;
  readonly db: Db;
  readonly collection: Collection<IMDBRelatedYouTubeVideoDoc>;
  readonly YOUTUBE_API__URL: string;
  readonly YOUTUBE_API__HEADERS_KEY: string;
  readonly YOUTUBE_API__HEADERS_HOST: string;
  private _indexesCreated: boolean;

  constructor(dbManager: ManagesDbs, opts: IMDBRelatedYouTubeVideoOptions) {
    this.dbManager = dbManager;
    this.db = dbManager.mainDb();
    this.collection = this.db.collection(COLLECTION);
    this.YOUTUBE_API__URL = opts.YOUTUBE_API__URL;
    this.YOUTUBE_API__HEADERS_KEY = opts.YOUTUBE_API__HEADERS_KEY;
    this.YOUTUBE_API__HEADERS_HOST = opts.YOUTUBE_API__HEADERS_HOST;
    this._indexesCreated = false;
  }

  /**
   * check whether indexes have been created
   * on youtubes collection
   */
  get indexesCreated(): boolean {
    return this._indexesCreated;
  }

  /**
   * creates required indexes on
   * youtubes collections
   * @throws DB_ERROR
   */
  async createIndexes(): Promise<void> {
    if (this._indexesCreated) return;
    try {
      await this.collection.createIndex({ _id: 1, imdbId: 1 }, {});
      this._indexesCreated = true;
    } catch (e) {
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }

  /**
   * Retrieves all IMDBRelatedYouTubeVideos documents from the database.
   */
  async getAll(): Promise<IMDBRelatedYouTubeVideoDoc[]> {
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
   * Retrieves an IMDBRelatedYouTubeVideos document by IMDB ID from the database.
   *
   * @param imdbId - The IMDB ID to search for.
   * @returns The IMDBRelatedYouTubeVideos document with the matching IMDB ID.
   * @throws {CoreError} If no matching document is found.
   */
  async getByIMDBId(imdbId: string): Promise<IMDBRelatedYouTubeVideoDoc> {
    try {
      const entry = await this.collection.findOne<IMDBRelatedYouTubeVideoDoc>({
        imdbId,
      });
      if (!entry) {
        throw new CoreError(
          messages.ERROR_IMDB_ENTRY_RELATED_VIDEOS_NOT_FOUND,
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

  async getByQuery(query: string, imdbId: string): Promise<IMDBRelatedYouTubeVideoDoc> {
    try {
      const data = await createRapidApiRequest({
        API_KEY: this.YOUTUBE_API__HEADERS_KEY,
        API_HOST: this.YOUTUBE_API__HEADERS_HOST,
        method: "POST",
        url: this.YOUTUBE_API__URL,
        data: { search_query: query },
      });
      if (!data || data.length === 0) {
        throw new CoreError(
          messages.ERROR_IMDB_ENTRY_RELATED_VIDEOS_NOT_FOUND,
          ErrorCode.DB_OBJECT_NOT_FOUND
        );
      }

      const entry = {
        _id: new ObjectId(),
        imdbId,
        relatedYoutubeVideos: data,
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

      return entry;
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      }
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }
}
