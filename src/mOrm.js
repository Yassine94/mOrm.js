import {isEmpty} from "lodash";
import {existSync} from 'fs';
import path from "path";
import PostgreSQL from "./engine/postgresql";

export default class mOrm {
    configPathName = "./mrom.config.json";
  
    async createConnection(dbConfig = {}, extras = { entities: [] }) {
        if (isEmpty(dbConfig)) {
            // console.log(__dirname);
            if (!existSync(path.join(__dirname, this.configPathName))) {
                throw new Error("Configuration file morm.config.js is required")
            }

            this.config = require(this.configPathName);
        } else {
            if (dbConfig.uri) {
                const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/g;

                const [, type, username, password, host, port, database] = regExp.exec(
                    dbConfig.uri
                );

                this.config = {
                    type,
                    username,
                    password,
                    host,
                    port,
                    database
                };
            } else {
                this.config = dbConfig
            }
            console.log(this.config);

            this.config.synchronize =
              dbConfig.synchronize !== undefined ? dbConfig.synchronize : false;
        
            // building entities dependencies
            this.entities = {};
            for (const entities of extras.entities) {
              this.entities[entities.prototype.constructor.name] = entities;
            }

            //Instantiate database engine

            switch(this.config.type) {
                case 'postgres':
                    this.dbInstance = new PostgreSQL(this.config, this.entities);
                    break;
                // case 'mysql':
                //     this.dbInstance = new MySQL(this.config)
                default:
                    throw new Error(`Engine ${this.config.type} not supported`);
            }
        }
        await this.dbInstance.initialize();
    }
    
    getEntity(name) {
        return new this.entities[name](this.dbInstance);
    }
}