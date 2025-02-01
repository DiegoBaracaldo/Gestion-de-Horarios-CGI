
class AmbienteRepo {

    constructor(db) {
        this.db = db;
    }

    async AtLeastOne() {
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM ambientes LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if (err) reject(err.errno);
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                ambientes.*, 
                torres.nombre AS nombreTorre  
                FROM  
                ambientes  
                JOIN  
                torres ON ambientes.idTorre = torres.id ;
            `;
            this.db.all(query, [], (err, filas) => {
                if (err) reject(err.errno);
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM ambientes WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error) reject(error.errno);
                else resolve(fila);
            });
        });
    }

    async GetAllById(arrayIds) {
        return new Promise((resolve, reject) => {
            const placeHolders = arrayIds.map(() => '?').join(', ');

            const query = `
                SELECT * FROM ambientes
                WHERE id IN (${placeHolders});
            `;

            this.db.all(query, arrayIds, (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }


    async SaveNew(ambiente) {
        const { nombre, idTorre, capacidad, franjaDisponibilidad } = ambiente;
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO ambientes " +
                "(nombre, idTorre, capacidad, franjaDisponibilidad) " +
                "VALUES (?, ?, ?, ?)";

            this.db.run(query, [nombre, idTorre, capacidad, franjaDisponibilidad], function (error) {
                if (error) reject(error.errno);
                else resolve(this.changes);
            });
        });
    }

    async Save(idViejo, ambiente) {
        return new Promise((resolve, reject) => {

            const { nombre, idTorre, capacidad, franjaDisponibilidad } = ambiente;
            const franjasArray = new Set(this.DeserealizarFranjas(franjaDisponibilidad));
            const franjasAEliminar = new Array(336).fill(null)
                .map((_, index) => index + 1)
                .filter(num => !franjasArray.has(num));
            const placeholderFranjas = franjasAEliminar.map(() => '?').join(', ');
            this.db.serialize(async () => {
                try {
                    this.db.run("BEGIN TRANSACTION");

                    const query = "UPDATE ambientes SET " +
                        "nombre = ?, " +
                        "idTorre = ?, capacidad = ?, " +
                        "franjaDisponibilidad = ?" +
                        "WHERE id = ?";
                    const queryDeleteFranjas = `
                        DELETE FROM franjas WHERE franja IN (${placeholderFranjas}) AND idAmbiente = ?; `;

                    await this.db.run(queryDeleteFranjas, [...franjasAEliminar, ambiente.id], (error) => {
                        if (error) reject(error.errno);
                        else resolve();
                    });

                    await this.db.run(query, [nombre, idTorre, capacidad, franjaDisponibilidad, idViejo], function (error) {
                        if (error) reject(error.errno);
                        else resolve(this.changes); // Devuelve el número de filas modificadas
                    });

                    this.db.run("COMMIT", function (error) {
                        if (error) {
                            this.db.run("ROLLBACK");
                            reject(error)
                        }
                        //Si todo fue exitoso!
                        else resolve(200);
                    });
                } catch (error) {
                    //Error en cualquier parte de las transacciones
                    this.db.run("ROLLBACK");
                    reject(error);
                }
            });

        });
    }

    //Se trabaja con array de ids a eliminar.
    async Remove(idArray) {
        return new Promise((resolve, reject) => {

            // Convertir el array de ids en una cadena de ? separada por comas para la consulta SQL
            const placeholders = idArray.map(() => '?').join(', ');
            const query = "DELETE FROM ambientes WHERE id IN (" + placeholders + ")";

            this.db.run(query, idArray, function (error) {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(this.changes); // Devuelve el número de filas eliminadas
                }
            });
        });
    }

    DeserealizarFranjas(texto) {
        return texto.split(',').map(item => Number(item.trim())) || [];
    }
}
module.exports = AmbienteRepo;