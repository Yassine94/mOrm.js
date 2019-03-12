// Classe abstraite permettant a chaque nouvelle table d'hériter des méthodes CRUD
export default class Entity {
    constructor(dbInstance, tableName){
        this.dbInstance = dbInstance;
        this.tableName = tableName;
    }

        // Execute un count 
    async count() {
      return this.dbInstance.count(this.tableName);
    }

        // Execute une insertion
    async save(data) {
        return this.dbInstance.save(data, this.tableName);
    }
        //Chercher depuis un identifiant unique

    async findByPk(id) {
        return this.dbInstance.findByPk(id, this.tableName)
    }
    
        // Affiche toutes les données de la table
    async findAll() {
        return this.dbInstance.findAll(this.tableName)
    }

        // Permet d'effacer une ligne 
    async remove(id) {
        return this.dbInstance.remove(id, this.tableName)
    }

        //Permet d'afficher une ligne en fonction des parametres
    async findOne(data) {
        return this.dbInstance.findOne(this.tableName, data)
    }

        //Permet de faire un update
    async update(data) {
        return this.dbInstance.update(this.tableName, data)
    }
}