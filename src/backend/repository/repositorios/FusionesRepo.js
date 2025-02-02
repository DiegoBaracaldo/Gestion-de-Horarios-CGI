class FusionesRepo {

    constructor(db){
        this.db = db;
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM fusiones";
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

}

module.exports = FusionesRepo;