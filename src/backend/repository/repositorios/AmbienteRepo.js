
class AmbienteRepo {

    constructor(db) {
        this.db = db;
    }

    async AtLeastOne(){
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM ambientes LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if(err) reject(err.errno);
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query =`
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
            const query = "UPDATE ambientes SET " +
                "nombre = ?, " +
                "idTorre = ?, capacidad = ?, " +
                "franjaDisponibilidad = ?" +
                "WHERE id = ?";
            const { nombre, idTorre, capacidad, franjaDisponibilidad } = ambiente; // Desestructuración del objeto torre

            this.db.run(query, [nombre, idTorre, capacidad, franjaDisponibilidad, idViejo], function (error) {
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
}
module.exports = AmbienteRepo;