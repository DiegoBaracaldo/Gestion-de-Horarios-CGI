
class InstructorRepo {

    constructor(db) {
        this.db = db;
    }

    async AtLeastOne() {
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM instructores LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if (err) reject(err.errno);
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT i.*,
                (SELECT COUNT(g.idResponsable)
                FROM grupos g
                WHERE g.idResponsable = i.id) AS cantidadGruposACargo
                FROM  instructores i;
            `;
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM instructores WHERE id = ?";
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
                SELECT * FROM instructores
                WHERE id IN (${placeHolders});
            `;

            this.db.all(query, arrayIds, (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    async SaveNew(instructor) {
        const { id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad } = instructor;
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO instructores " +
                "(id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

            this.db.run(query, [id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad], function (error) {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    async Save(idViejo, instructor) {
        return new Promise((resolve, reject) => {

            const { id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad } = instructor;
            const franjasArray = new Set(this.DeserealizarFranjas(franjaDisponibilidad));
            const franjasAEliminar = new Array(336).fill(null)
                .map((_, index) => index + 1)
                .filter(num => !franjasArray.has(num));
            const placeholderFranjas = franjasAEliminar.map(() => '?').join(', ');
            this.db.serialize(async () => {
                try {
                    await this.db.run("BEGIN TRANSACTION");

                    const query = "UPDATE instructores SET " +
                        "id = ?, nombre = ?, " +
                        "topeHoras = ?, correo = ?, " +
                        "telefono = ?, especialidad = ?, franjaDisponibilidad = ?" +
                        "WHERE id = ?";
                    const queryDeleteFranjas = `
                        DELETE FROM franjas WHERE franja IN (${placeholderFranjas}) AND idInstructor = ?; `;

                    await this.db.run(queryDeleteFranjas, [...franjasAEliminar, id], (error) => {
                        if (error) reject(error.errno);
                        else resolve();
                    });

                    await this.db.run(query, [id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad, idViejo], function (error) {
                        if (error) reject(error.errno);
                        else resolve(this.changes); // Devuelve el número de filas modificadas
                    });

                    await this.db.run("COMMIT", function (error) {
                        if (error) {
                            this.db.run("ROLLBACK");
                            reject(error.errno)
                        }
                        //Si todo fue exitoso!
                        else resolve(200);
                    });

                } catch (error) {
                    //Error en cualquier parte de las transacciones
                    await this.db.run("ROLLBACK");
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
            const query = "DELETE FROM instructores WHERE id IN (" + placeholders + ")";

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
module.exports = InstructorRepo;