import { MongoClient, Db } from 'mongodb';
import { ErrorCode, CoreError, CoreMessage } from '.';
import { ManagesDbs } from './types';

export interface DbManagerOptions {
    prefix?: string;
    mainDb?: string;
}

/**
 * manages connections to multiple
 * MongoDB databases on the same host
 */
export class DbManager implements ManagesDbs {
    private connectionUrl: string;
    private _client: MongoClient;
    private prefix: string = '';
    private mainDbName: string = '';

    /**
     * @param connectionUrl mongodb uri to the database host, does not to include database
     * @param options allows you to set prefix and main db
     */
    constructor (connectionUrl: string, options: DbManagerOptions = { mainDb: '', prefix: ''}) {
        this.connectionUrl = connectionUrl;
        const { prefix, mainDb } = options;
        this.prefix = prefix || '';
        this.mainDbName = mainDb || '';
    }

    private getTrueName (name: string): string {
        return this.prefix + name;
    }

    /**
     * initializes the db manager's connection,
     * should be called before use
     */
    async initialize (): Promise<void> {
        if (this._client == undefined) {
            try {
                this._client = new MongoClient(this.connectionUrl);
                await this._client.connect();
            }
            catch (e) {
                throw new CoreError(e.message, ErrorCode.DB_CONNECTION_FAILED);
            }
        }
    }

    /**
     * returns connection to the specified
     * database name. The manager should
     * be initialized first before calling this.
     * @param name database name
     * @return specified database instance
     */
    db (name: string): Db {
        if (this._client == undefined) {
            throw new CoreError(CoreMessage.ERROR_DB_MANAGER_NOT_INITIALIZED,
                ErrorCode.DB_MANAGER_NOT_INITIALIZED);
        }
        // no need to cache db instance cause the MongoDB driver
        // already does
        return this._client.db(this.getTrueName(name));
    }

    /**
     * returns the main db of the manager
     * throws error if no main db was specified on the constructor
     * @return main database instance
     */
    mainDb (): Db {
        if (this.mainDbName == '') {
            throw new CoreError(CoreMessage.ERROR_MAIN_DB_NOT_SPECIFIED,
                ErrorCode.MAIN_DB_NOT_SPECIFIED);
        }
        return this.db(this.mainDbName);
    }

    /**
     * Closes the database connection
     * @returns
     */
    close(): Promise<void> {
        return this._client?.close();
    }

    get connection (): MongoClient {
        return this._client;
    }
}