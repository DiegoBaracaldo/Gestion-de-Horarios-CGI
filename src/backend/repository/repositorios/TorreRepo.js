
class TorreRepo {

    constructor(db) {
        this.db = db;
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM torres";
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error);
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM torres WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error) reject(error);
                else resolve(fila);
            });
        });
    }

    async SaveNew(nombre) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO torres (nombre) VALUES (?)";

            this.db.run(query, [nombre], function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve({ id: this.lastID }); // Devuelve el ID de la nueva torre
                }
            });
        });
    }

    async Save(idViejo, torre) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE torres SET nombre = ? WHERE id = ?";
            const { nombre } = torre; // Desestructuración del objeto torre

            this.db.run(query, [nombre, idViejo], function (error) {
                if (error) reject(error);
                else resolve({ changes: this.changes }); // Devuelve el número de filas modificadas
            });
        });
    }

    //Se trabaja con array de ids a eliminar.
    async Remove(idArray) {
        return new Promise((resolve, reject) => {

            // Convertir el array de ids en una cadena de ? separada por comas para la consulta SQL
            const placeholders = idArray.map(() => '?').join(', ');
            const query = "DELETE FROM torres WHERE id IN (" + placeholders + ")";

            this.db.run(query, idArray, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve({ changes: this.changes }); // Devuelve el número de filas eliminadas
                }
            });
        });
    }
}
module.exports = TorreRepo;