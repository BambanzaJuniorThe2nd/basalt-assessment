import { YouTubeDoc, YoutubeRepository, YoutubeRepoOpts } from "../types";
import { ManagesDbs, CoreError, ErrorCode, CoreMessage as messages } from "..";
import { createRapidApiRequest } from "../util";
import { Db, Collection, ObjectId } from "mongodb";

const COLLECTION = "youtubeDocs";
export class YoutubeService implements YoutubeRepository {
  readonly dbManager: ManagesDbs;
  readonly db: Db;
  readonly collection: Collection<YouTubeDoc>;
  readonly YOUTUBE_API__URL: string;
  readonly YOUTUBE_API__HEADERS_KEY: string;
  readonly YOUTUBE_API__HEADERS_HOST: string;
  private _indexesCreated: boolean;

  constructor(dbManager: ManagesDbs, opts: YoutubeRepoOpts) {
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
  async getAll(): Promise<YouTubeDoc[]> {
    try {
      const result = this.collection.find({});
      return await result.toArray();
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      }
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }

  /**
   * Retrieves an IMDBRelatedYouTubeVideo document from the database by IMDB ID.
   * @param imdbId - The IMDB ID of the document to retrieve.
   * @returns The retrieved IMDBRelatedYouTubeVideo document.
   * @throws {CoreError} If no document is found for the given IMDB ID.
   */
  async getByIMDBId(imdbId: string): Promise<YouTubeDoc> {
    try {
      const entry = await this.collection.findOne<YouTubeDoc>({
        imdbId,
      });
      if (!entry) {
        throw new CoreError(
          messages.ERROR_YOUTUBE_DOC_NOT_FOUND,
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
   * Retrieves an IMDBRelatedYouTubeVideo document from the database by searching YouTube.
   * @param query - The search query to use for finding related YouTube videos.
   * @param imdbId - The IMDB ID to associate the found YouTube videos with.
   * @returns The created IMDBRelatedYouTubeVideo document.
   */
  async getByQuery(query: string, imdbId: string): Promise<YouTubeDoc> {
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
          messages.ERROR_YOUTUBE_DOC_NOT_FOUND,
          ErrorCode.DB_OBJECT_NOT_FOUND
        );
      }

      const doc = {
        _id: new ObjectId(),
        imdbId,
        relatedYoutubeVideos: data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await this.collection.insertOne(doc);
      if (!res.acknowledged) {
        throw new CoreError(
          messages.ERROR_YOUTUBE_DOC_INSERT_FAILED,
          ErrorCode.DB_OP_FAILED
        );
      }

      return doc;
    } catch (e) {
      if (e instanceof CoreError) {
        throw e;
      }
      throw new CoreError(e.message, ErrorCode.DB_ERROR);
    }
  }
}
