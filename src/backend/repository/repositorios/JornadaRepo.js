
class JornadaRepo {

    constructor(db) {
        this.db = db;
    }

    async ActivarLlavesForaneas() {
        return new Promise((resolve, reject) => {
            this.db.run("PRAGMA foreign_keys = ON;", function (error) {
                if (error) {
                    reject(error);
                }
                else resolve();
            });
        });
    }

    //En  la función de registro múltiple, se debe verificar que no se crucen los horarios aquí en repo

    async AtLeastOne() {
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM jornadas LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if (err) {
                    reject(err.errno);
                }
                else resolve(fila.hasRecords);
            });
        });
    }

    GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM jornadas";
            this.db.all(query, [], (error, filas) => {
                if (error) {
                    reject(error.errno);
                }
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM jornadas WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error) {
                    reject(error.errno);
                }
                else resolve(fila);
            });
        });
    }

    async GetAllFranjas() {
        return new Promise((resolve, reject) => {
            const query = "SELECT franjaDisponibilidad from jornadas";
            this.db.all(query, [], (error, filas) => {
                if (error) {
                    reject(error.errno);
                }
                else resolve(filas);
            });
        });
    }

    async SaveNew(jornada) {
        const { tipo, franjaDisponibilidad } = jornada;
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
            const { tipo, franjaDisponibilidad } = jornada;
            const franjasArray = new Set(this.DeserealizarFranjas(franjaDisponibilidad));
            const franjasAEliminar = new Array(336).fill(null)
                .map((_, index) => index + 1)
                .filter(num => !franjasArray.has(num));
            const placeholderFranjas = franjasAEliminar.map(() => '?').join(', ');

            const queryGetIdGrupos = `
                SELECT id AS idGrupo FROM grupos WHERE idJornada = ?`;

            const query = "UPDATE jornadas SET tipo = ?, franjaDisponibilidad = ? WHERE id = ?";

            const queryDeleteFranjas = `
            DELETE FROM franjas WHERE franja IN (${placeholderFranjas}) AND idGrupo = ?; `;

            this.db.serialize(async () => {
                try {
                    await this.ActivarLlavesForaneas();
                    await this.db.run("BEGIN TRANSACTION");

                    //Primero se modifica la jornada
                    const modificacionesJornada =
                        await this.db.run(query, [tipo, franjaDisponibilidad, idViejo], function (error) {
                            if (error) reject(error);
                            else resolve(this.changes);
                        });

                    if (modificacionesJornada <= 0) {
                        const nuevoError = new Error("No se modificó la jornada");
                        nuevoError.errno = 909;
                        throw nuevoError;
                    }

                    //Eliminación de las franjas asociadas a los grupos asociados a la jornada
                    //// que se eliminaron de la disponibilidad
                    let arrayIdGrupos = await new Promise((resolve, reject) => {
                        this.db.all(queryGetIdGrupos, [jornada.id], function (error, filas) {
                            if (error) {
                                console.log(error.errno);
                                reject(null);
                            }
                            else {
                                resolve(filas.map(fila => fila.idGrupo));
                            }
                        });
                    });


                    if (arrayIdGrupos.length > 0) {
                        const arrayPromesas = arrayIdGrupos.map(idGrupo =>
                            new Promise((resolve, reject) => {
                                this.db.run(queryDeleteFranjas, [...franjasAEliminar, idGrupo], function (err) {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            })
                        );
                        await Promise.all(arrayPromesas);
                    }

                    //AQUÍ SE LLEGA SI TODO SALIÓ BIEN
                    await new Promise((resolve, reject) => {
                        this.db.run('COMMIT', [], function (error) {
                            if (error) reject(error);
                            else return resolve(this);
                        });
                    });
                    resolve(200);
                } catch (errorCatch) {
                    //Error en cualquier parte de las transacciones
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
            const query = "DELETE FROM jornadas WHERE id IN (" + placeholders + ")";

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
                    reject(error.errno)
                }
            });
        });
    }

    DeserealizarFranjas(texto) {
        return texto.split(',').map(item => Number(item.trim())) || [];
    }
}
module.exports = JornadaRepo;