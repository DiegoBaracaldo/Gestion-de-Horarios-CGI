
class InstructorRepo {

    constructor(db) {
        this.db = db;
    }

    async AtLeastOne(){
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM instructores LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if(err) reject(err);
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM instructores";
            this.db.all(query, [], (error, filas) => {
                if(error) reject(error);
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM instructores WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error) reject(error);
                else resolve(fila);
            });
        });
    }

    async SaveNew(instructor) {
        const {id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad} = instructor;
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO instructores "+
            "(id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) "+
            "VALUES (?, ?, ?, ?, ?, ?, ?)";

            this.db.run(query, [id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad], function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve({ id: this.lastID }); // Devuelve el ID de la nueva torre
                }
            });
        });
    }

    async Save(idViejo, instructor) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE instructores SET "+
            "id = ?, nombre = ?, "+
            "topeHoras = ?, correo = ?, " +
            "telefono = ?, especialidad = ?, franjaDisponibilidad = ?"+
            "WHERE id = ?";
            const {id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad} = instructor; // Desestructuración del objeto torre

            this.db.run(query, [id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad, idViejo], function (error) {
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
            const query = "DELETE FROM instructores WHERE id IN (" + placeholders + ")";

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
module.exports = InstructorRepo;