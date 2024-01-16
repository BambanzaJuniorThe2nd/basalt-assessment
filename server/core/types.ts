import { Db, ObjectId } from 'mongodb';

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
