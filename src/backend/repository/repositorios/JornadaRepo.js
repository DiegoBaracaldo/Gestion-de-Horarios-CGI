class JornadaRepo {

    constructor(db) {
        this.db = db;
    }
    
    async AtLeastOne(){
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM jornadas LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if(err) reject(err.errno);
                else resolve(fila.hasRecords);
            });
        });
    }

    GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM jornadas";
            this.db.all(query, [], (error, filas) => {
                if(error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM jornadas WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error) reject(error.errno);
                else resolve(fila);
            });
        });
    }

    async SaveNew(jornada) {
        const {tipo, franjaDisponibilidad} = jornada;
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO jornadas (tipo, franjaDisponibilidad) VALUES (?, ?)";

            this.db.run(query, [tipo, franjaDisponibilidad], function (error) {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    async Save(idViejo, jornada) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE jornadas SET tipo = ?, franjaDisponibilidad = ? WHERE id = ?";
            const { tipo, franjaDisponibilidad } = jornada; // Desestructuración del objeto torre

            this.db.run(query, [tipo, franjaDisponibilidad, idViejo], function (error) {
                if (error) reject(error.errno);
                else resolve(this.changes); // Devuelve el número de filas modificadas
            });
        });
    }

    //Se trabaja con array de ids a eliminar.
    async Remove(idArray) {
        return new Promise((resolve, reject) => {

            // Convertir el array de ids en una cadena de ? separada por comas para la consulta SQL
            const placeholders = idArray.map(() => '?').join(', ');
            const query = "DELETE FROM jornadas WHERE id IN (" + placeholders + ")";

            this.db.run(query, idArray, function (error) {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(this.changes); // Devuelve el número de filas eliminadas
                }
            });
        });
    }
}
module.exports = JornadaRepo;