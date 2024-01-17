import { Db, ObjectId } from "mongodb";

/**
 * Interface for core configuration options.
 * Contains fields for base URL, database URLs,
 * database names, and client base URL.
 */
export interface CoreConfig {
  baseUrl: string;
  dbUrl: string;
  dbMain: string;
  dbPrefix: string;
  clientBaseUrl: string;
  IMDB_API__URL: string;
  IMDB_API__HEADERS_KEY: string;
  IMDB_API__HEADERS_HOST: string;
  YOUTUBE_API__URL: string;
  YOUTUBE_API__HEADERS_KEY: string;
  YOUTUBE_API__HEADERS_HOST: string;
}

export interface ManagesDbs {
  initialize(): Promise<void>;
  mainDb(): Db;
  db(name: string): Db;
}

export interface Container {
  readonly aggregatorService: AggregatorRepository;
}

/**
 * Interface for an object ID field on a document.
 * Contains a MongoDB ObjectId field called _id.
 */
export interface HasId {
  _id: ObjectId;
}

/**
 * Interface for timestamp fields on a document.
 * Contains createdAt and updatedAt Date fields.
 */
export interface HasTimestamp {
  updatedAt: Date;
  createdAt: Date;
}

/**
 * Interface defining the specific fields returned from the IMDB API
 * that will be part of the IMDBDoc model.
 */
export interface SpecificFieldsToIMDBDoc {
  image: { height: number; id: string; url: string; width: number };
  runningTimeInMinutes: number;
  title: string;
  titleType: string;
  year: number;
  principals: {
    id: string;
    legacyNameText: string;
    name: string;
    billing: number;
    category: string;
    characters: string[];
  }[];
}

/**
 * Interface defining a field for storing an IMDB ID on a document.
 * Contains an imdbId string field.
 */
export interface HasIMDBId {
  imdbId: string;
}

/**
 * Interface defining the shape of the IMDBDoc model,
 * which contains the fields from various included interfaces.
 */
export interface IMDBDoc
  extends HasId,
    HasIMDBId,
    SpecificFieldsToIMDBDoc,
    HasTimestamp {}

/**
 * Interface defining the methods that should be implemented by a repository
 * for interacting with IMDB document data in the database.
 */
export interface IMDBRepository {
  getAll(): Promise<IMDBDoc[]>;
  getById(id: string): Promise<IMDBDoc>;
  getByIMDBId(imdbId: string): Promise<IMDBDoc>;
  getByTitle(title: string): Promise<IMDBDoc>;
}

/**
 * Interface defining options for making requests to the IMDB API.
 * Contains typical fields like url, headers with API key and host.
 */
export interface IMDBRepoOpts {
  IMDB_API__URL: string;
  IMDB_API__HEADERS_KEY: string;
  IMDB_API__HEADERS_HOST: string;
}

/**
 * Interface defining options for making requests to the YouTube API.
 * Contains typical fields like url, headers with API key and host.
 */
export interface YoutubeRepoOpts {
  YOUTUBE_API__URL: string;
  YOUTUBE_API__HEADERS_KEY: string;
  YOUTUBE_API__HEADERS_HOST: string;
}

/**
 * Interface defining options for making requests to the RapidAPI.
 * Contains typical fields like url, method, API key, host,
 * params, and data.
 */
export interface RapidApiRequestOptions {
  url: string;
  method: string;
  API_KEY: string;
  API_HOST: string;
  params?: object;
  data?: object;
}

/**
 * Interface defining the fields specific to a YouTube document
 * that contain data fetched from the YouTube API.
 */
export interface SpecificFieldsToYoutubeDoc {
  relatedYoutubeVideos: {
    videoId: string;
    thumbnail: string;
    title: string;
    author: { profile: string; name: string };
    viewCount: string;
    duration: string;
    published: string;
    description: string;
  }[];
}

/**
 * Interface defining the fields specific to a YouTube document
 * that contain data fetched from the YouTube API.
 */
export interface YouTubeDoc
  extends HasId,
    HasIMDBId,
    SpecificFieldsToYoutubeDoc,
    HasTimestamp {}

/**
 * Interface defining the methods available in the YouTube repository.
 * Contains methods for fetching YouTube videos by ID, IMDB ID, or search query.
 */
export interface YoutubeRepository {
  getAll(): Promise<YouTubeDoc[]>;
  getByIMDBId(imdbId: string): Promise<YouTubeDoc>;
  getByQuery(query: string, imdbId: string): Promise<YouTubeDoc>;
}

/**
 * Interface defining the fields for an aggregator document.
 * Aggregator documents contain aggregated data from multiple sources.
 */
export interface AggregatorDoc
  extends HasId,
    HasIMDBId,
    SpecificFieldsToIMDBDoc,
    SpecificFieldsToYoutubeDoc,
    HasTimestamp {}

export interface AggregatorRepository {
  getAll(): Promise<AggregatorDoc[]>;
  getById(id: string): Promise<AggregatorDoc>;
  getBySearchTerm(term: string): Promise<AggregatorDoc>;
}
