import Core from "./core";
import { Client } from "pg";

export default class PostgreSQL extends Core {
    constructor(options) {
        super(options);
    }

    async initialize() {
        const { host, port, username, password, database } = this

        this.client = new Client({
            user: username,
            host,
            port,
            database,
            password
        });

        try {
            await this.client.connect();
            await this.createTable();
        } catch (e) {
            console.log(`Database ${database} doesn't exist`);
        }
    }

    async createTable(){
            this.client.query(`CREATE TABLE IF NOT EXISTS Student (
                id  SERIAL PRIMARY KEY,
                firstname varchar(255) NOT NULL,
                lastname varchar(255) NOT NULL,
                age integer NULL
                )
        `, (err, res) => {
                    // console.log(err, res);
                    // this.client.end();
        });
    }

    async count(entity) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT COUNT(*) FROM ${entity}`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows[0].count);
                }
            });
        });
    }


    async save(data, entity) {
        return new Promise((resolve, reject) => {
            this.client.query(`INSERT INTO ${entity} (firstname, lastname)
                VALUES ('${data.firstname}', '${data.lastname}')`, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows[0]);
                    }
                });
        });
    }

    async findByPk(id, entity) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT * FROM ${entity} WHERE  id = '${id}'`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows[0]);
                }
            });
        });
    }
    async findAll(entity) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT * FROM ${entity} `, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // null et 2 permettent d'afficher correctement le json
                    resolve(JSON.stringify(result.rows, null, 2));
                }
            });
        });
    }

    async remove(data, entity) {
        return new Promise((resolve, reject) => {
            this.client.query(`DELETE FROM ${entity} WHERE  id = '${data}'`, (err, result) => {
                if (err) {


                    reject(err);
                    console.log('FAIL');
                } else {

                    // if(resolve(result)){
                    //     console.log('SUCCESS');
                    // }
                    result.rowCount == 1 ? console.log(`The user ${data} has been deleted`) : console.log(`Error the user ${data} doesn't exist`);

                }
            });
        });
    }
    async findOne(entity, data) {
        const excel = data.attributes ? data.attributes.join(', ') : '*';
        
        try {
            const keysWhere = Object.keys(data.where);
            const valuesWhere = keysWhere.map((keyWhere) => {
            const valueWhere = data.where[keyWhere];
              return `${keyWhere}=${valueWhere}`;
            }).join('and ');
            const where = data.where ? valuesWhere : ''
            
            return new Promise((resolve, reject) => {
                this.client.query(`SELECT ${excel} FROM ${entity} WHERE ${where} LIMIT 1`, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows[0]);
                    }
                });
            });
 
          } catch (e) {
            // console.log(`cannot update ${entity} -- ${e}`);
          }
    }


    async update(entity, data) {
        try {
            let keys = Object.keys(data.attributes);
            let values = keys.map((key) => {
              let value = data.attributes[key];
              return `${key}='${value}'`;
            }).join(', ');
      
            let keysWhere = Object.keys(data.where);
            let valuesWhere = keysWhere.map((keyWhere) => {
              let valueWhere = data.where[keyWhere];
              return `${keyWhere}='${valueWhere}'`;
            }).join('and ');
      
            let res = await this.client.query(`update ${entity} set ${values} where ${valuesWhere} returning *`)
            return res.rows[0];
          } catch (e) {
            console.log(`cannot update ${entity} -- ${e}`);
          }
    }










}