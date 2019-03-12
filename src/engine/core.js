// Classe Mere  pour la base de donnée chaque engine hérite de celle ci
export default class Core {
    constructor({ host, port, username, password, database, synchronize }, entities) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.database = database;
        this.entities = entities;
        this.synchronize = synchronize;
    }

    dump() {
        console.log(`Database informations:
            host : ${this.host}
            port: ${this.port}
            username: ${this.username}
            password: ${this.password}
            database: ${this.database}
            entities: ${this.entities}
        `);
    }
}