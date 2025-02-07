
class TorreRepo {

    constructor(db) {
        this.db = db;
    }

    async ActivarLlavesForaneas() {
        return new Promise((resolve, reject) => {
            this.db.run("PRAGMA foreign_keys = ON;", function (error) {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    async AtLeastOne(){
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM torres LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if(err) reject(err.errno);
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM torres";
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM torres WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error) reject(error.errno);
                else resolve(fila);
            });
        });
    }

    async SaveNew(nombre) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO torres (nombre) VALUES (?)";

            this.db.run(query, [nombre], function (error) {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(this.changes); 
                }
            });
        });
    }

    async Save(idViejo, torre) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE torres SET nombre = ? WHERE id = ?";
            const { nombre } = torre; // Desestructuración del objeto torre

            this.db.serialize(async() => {
                try {
                    await this.ActivarLlavesForaneas();
                    this.db.run(query, [nombre, idViejo], function (error) {
                        if (error) reject(error.errno);
                        else resolve(this.changes); // Devuelve el número de filas modificadas
                    });
                } catch (error) {
                    reject(error.errno)
                }
            });
        });
    }

    //Se trabaja con array de ids a eliminar.
    async Remove(idArray) {
        return new Promise((resolve, reject) => {

            // Convertir el array de ids en una cadena de ? separada por comas para la consulta SQL
            const placeholders = idArray.map(() => '?').join(', ');
            const query = "DELETE FROM torres WHERE id IN (" + placeholders + ")";

            this.db.serialize(async() => {
                try {
                    await this.ActivarLlavesForaneas();
                    this.db.run(query, idArray, function (error) {
                        if (error) {
                            reject(error.errno);
                        } else {
                            resolve(this.changes); // Devuelve el número de filas eliminadas
                        }
                    });
                } catch (error) {
                    reject(error.errno)
                }
            });
        });
    }
}
module.exports = TorreRepo;