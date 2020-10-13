import { Db, DBRef, MongoClient } from 'mongodb';
import assert = require('assert');
import { config } from '../../config/index';
let ObjectId = require('mongodb').ObjectId


export class Database {
    static db: Db;

    static async init() {
        this.db = await this._getMongoDb(config.mongoUrl);
    }

    private static _getMongoDb(uri: string): Promise<Db> {
        console.log(`Start connecting db...(${uri})`)
        let promise = new Promise<Db>((rs, rj) => {
            MongoClient.connect(uri, {
                autoReconnect: true,
                poolSize: 5
            }, (err, client) => {
                if (err) {
                    console.error('× Failed connected db.', err)
                    rj(err);
                } else {
                    console.log(`√ Connect db succ. (${uri})`)
                    rs(client.db());
                }
            })
        })
        return promise;
    }
    static deCodeId(id:string){
        return ObjectId(id)
    }
}

