
class ProgramaRepo {

    constructor(db) {
        this.db = db;
    }

    async ActivarLlavesForaneas() {
        return new Promise((resolve, reject) => {
            this.db.run("PRAGMA foreign_keys = ON;", function (error) {
                if (error){
                    reject(error);
                } 
                else resolve();
            });
        });
    }


    async AtLeastOne() {
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM programas LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if (err){
                    reject(err.errno);
                } 
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM programas";
            this.db.all(query, [], (err, filas) => {
                if (err){
                    reject(err.errno);
                }
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM programas WHERE id = ?";
            this.db.get(query, [id], (err, fila) => {
                if (err){
                    reject(err.errno);
                }
                else resolve(fila);
            });
        });
    }

    SaveNew(programa) {
        const { id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin } = programa;
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO programas " +
                "(id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

            this.db.run(query, [id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin], function (error) {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    Save(idViejo, programa) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE programas SET " +
                "id=?, nombre=?, tipo=?, cantidadTrimestres=?, fechaInicio=?, fechaFin=?  WHERE id = ?";
            const { id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin } = programa; // Desestructuración del objeto torre

            this.db.serialize(async () => {
                try {
                    await this.ActivarLlavesForaneas();
                    this.db.run(query, [id, nombre, tipo, cantidadTrimestres, fechaInicio, fechaFin, idViejo], function (error) {
                        if (error) {
                            reject(error.errno);
                        }
                        else resolve(this.changes); // Devuelve el número de filas modificadas
                    });
                } catch (error) {
                    reject(error.errno);
                }

            });
        });
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray) {
        return new Promise((resolve, reject) => {
            // Convertir el array de ids en una cadena de ? separada por comas para la consulta SQL
            const placeholders = idArray.map(() => '?').join(', ');
            const query = "DELETE FROM programas WHERE id IN (" + placeholders + ")";

            this.db.serialize(async () => {
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
                    reject(error.errno);
                }
            });
        });
    }
}
module.exports = ProgramaRepo;