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
}

export interface ManagesDbs {
  initialize(): Promise<void>;
  mainDb(): Db;
  db(name: string): Db;
}

export interface Container {}

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
 * Interface for an IMDB movie entry.
 * Contains typical fields for an entry like id, title, year,
 * running time, principals, etc.
 */
export interface IMDBEntry extends HasId, HasTimestamp {
  imdbId: string;
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
 * Interface for an IMDB movie entry repository.
 * Contains methods for getting all entries, getting by ID,
 * and getting by title.
 */
export interface IMDBEntryRepository {
  getAll(): Promise<IMDBEntry[]>;
  getById(id: string): Promise<IMDBEntry>;
  getByIMDBId(imdbId: string): Promise<IMDBEntry>;
  getByTitle(title: string): Promise<IMDBEntry>;
}

/**
 * Interface for options to make requests to the IMDB API.
 * Contains the base URL, headers key, and headers host.
 */
export interface IMDBEntryOptions {
  IMDB_API__URL: string;
  IMDB_API__HEADERS_KEY: string;
  IMDB_API__HEADERS_HOST: string;
}
