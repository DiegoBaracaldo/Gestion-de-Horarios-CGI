
class InstructorRepo {

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

            const query = "UPDATE instructores SET " +
                "id = ?, nombre = ?, " +
                "topeHoras = ?, correo = ?, " +
                "telefono = ?, especialidad = ?, franjaDisponibilidad = ?" +
                "WHERE id = ?";
            const queryDeleteFranjas = `
                DELETE FROM franjas WHERE franja IN (${placeholderFranjas}) AND idInstructor = ?; `;

            let numeroFilasEditadas = 0;

            this.db.serialize(async () => {
                try {
                    await this.ActivarLlavesForaneas();

                    await this.db.run("BEGIN TRANSACTION");

                    const modificacionesInstructor =
                        await new Promise((resolve, reject) => {
                            this.db.run(query, [id, nombre, topeHoras, correo, telefono, especialidad, franjaDisponibilidad, idViejo], function (error) {
                                if (error) reject(error.errno);
                                else resolve(this.changes); // Devuelve el número de filas modificadas
                            });
                        });

                    if (modificacionesInstructor <= 0) {
                        const nuevoError = new Error("No se editó el instructor!");
                        nuevoError.errno = 907;
                        throw nuevoError;
                    }

                    numeroFilasEditadas += modificacionesInstructor;

                    await new Promise((resolve, reject) => {
                        this.db.run(queryDeleteFranjas, [...franjasAEliminar, id], (error) => {
                            if (error) reject(error.errno);
                            else resolve(this.changes);
                        });
                    });

                    //AQUÍ SE LLEGA SI TODO SALIÓ BIEN
                    await new Promise((resolve, reject) => {
                        this.db.run('COMMIT', [], function (error) {
                            if (error) reject(error);
                            else return resolve(this);
                        });
                    });
                    resolve(numeroFilasEditadas);
                } catch (errorCatch) {
                    const respuestaRollback =
                        await new Promise((resolve, reject) => {
                            this.db.run("ROLLBACK", [], function (error) {
                                if (error) reject(902);
                                //Es una resolución, pero de un rollback, se envía entonces el error que lo causó
                                else resolve(errorCatch.errno);
                            });
                        });
                    reject(respuestaRollback);
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

    DeserealizarFranjas(texto) {
        return texto.split(',').map(item => Number(item.trim())) || [];
    }
}
module.exports = InstructorRepo;