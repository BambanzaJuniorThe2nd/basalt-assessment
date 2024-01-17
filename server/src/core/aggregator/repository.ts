import { AggregatorDoc, IMDBRepository, YoutubeRepository, AggregatorRepository } from "../types";
import { ManagesDbs, CoreError, ErrorCode, CoreMessage as messages } from "..";
import { Db, Collection, ObjectId } from "mongodb";

export interface AggregatorArgs {
  imdbDocs: IMDBRepository;
  youtubeDocs: YoutubeRepository;
}

const COLLECTION = "aggregatorDocs";
export class AggregatorDocs implements AggregatorRepository {
  readonly dbManager: ManagesDbs;
  readonly db: Db;
  readonly collection: Collection<AggregatorDoc>;
  readonly imdbDocs: IMDBRepository;
  readonly youtubeDocs: YoutubeRepository;
  private _indexesCreated: boolean;

  constructor(dbManager: ManagesDbs, args: AggregatorArgs) {
    this.dbManager = dbManager;
    this.db = dbManager.mainDb();
    this.collection = this.db.collection(COLLECTION);
    this.imdbDocs = args.imdbDocs;
    this.youtubeDocs = args.youtubeDocs;
    this._indexesCreated = false;
  }

  /**
   * Checks if the necessary indexes have been created on the aggregator collection.
   */
  get indexesCreated(): boolean {
    return this._indexesCreated;
  }

  /**
   * Creates any necessary indexes on the aggregator collection.
   * This should be called after the collection is created.
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
   * Retrieves all documents from the aggregator collection.
   */
  async getAll(): Promise<AggregatorDoc[]> {
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
   * Retrieves an aggregator document by its MongoDB ID.
   *
   * @param id - The MongoDB ID of the document to retrieve.
   * @returns The aggregator document if found, else throws error.
   */
  async getById(id: string): Promise<AggregatorDoc> {
    try {
      const entry = await this.collection.findOne<AggregatorDoc>({
        _id: new ObjectId(id),
      });
      if (!entry) {
        throw new CoreError(
          messages.ERROR_AGGREGATOR_DOC_NOT_FOUND,
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
   * Retrieves an aggregator document by searching for a title term.
   * If no document is found, attempts to create one from IMDB and YouTube data.
   *
   * @param term - The search term to find a matching title.
   * @returns The found or created aggregator document.
   */
  async getBySearchTerm(term: string): Promise<AggregatorDoc> {
    try {
      const cleanedTerm = term.replace(/\s/g, "");
      const query = { title: { $regex: new RegExp(cleanedTerm, "i") } };
      let doc = await this.collection.findOne<AggregatorDoc>(query);

      if (!doc) {
        const imdbDoc = await this.imdbDocs.getByTitle(term);
        if (imdbDoc) {
          const youtubeDocs = await this.youtubeDocs.getByQuery(
            `${imdbDoc.title} ${imdbDoc.year}`,
            imdbDoc.imdbId
          );
          doc = {
            _id: new ObjectId(),
            imdbId: imdbDoc.imdbId,
            image: imdbDoc.image,
            runningTimeInMinutes: imdbDoc.runningTimeInMinutes,
            title: imdbDoc.title,
            titleType: imdbDoc.titleType,
            year: imdbDoc.year,
            principals: imdbDoc.principals,
            relatedYoutubeVideos: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          if (youtubeDocs) {
            doc = { ...doc, relatedYoutubeVideos: youtubeDocs.relatedYoutubeVideos };
            };
          }

          await this.collection.insertOne(doc);
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
