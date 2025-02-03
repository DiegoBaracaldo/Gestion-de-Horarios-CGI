class JornadaRepo {

    constructor(db) {
        this.db = db;
    }

    //En  la función de registro múltiple, se debe verificar que no se crucen los horarios aquí en repo

    async AtLeastOne() {
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM jornadas LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if (err) reject(err.errno);
                else resolve(fila.hasRecords);
            });
        });
    }

    GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM jornadas";
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
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

    async GetAllFranjas() {
        return new Promise((resolve, reject) => {
            const query = "SELECT franjaDisponibilidad from jornadas";
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error);
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
            this.db.serialize(async () => {
                try {
                    await this.db.run("BEGIN TRANSACTION");

                    const queryGetIdGrupos = `
                        SELECT id AS idGrupo FROM grupos WHERE idJornada = ?`;
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
                    if (arrayIdGrupos !== null && arrayIdGrupos.length > 0) {
                        const queryDeleteFranjas = `
                            DELETE FROM franjas WHERE franja IN (${placeholderFranjas}) AND idGrupo = ?; `;
                        const arrayPromesas = arrayIdGrupos.map(idGrupo =>
                            new Promise((resolve, reject) => {
                                this.db.run(queryDeleteFranjas, [...franjasAEliminar, idGrupo], function (err) {
                                    if (err) reject(err.errno);
                                    else resolve();
                                });
                            })
                        );
                        await Promise.all(arrayPromesas);
                    }

                    const query = "UPDATE jornadas SET tipo = ?, franjaDisponibilidad = ? WHERE id = ?";
                    await this.db.run(query, [tipo, franjaDisponibilidad, idViejo], function (error) {
                        if (error) reject(error.errno);
                        else resolve(this.changes);
                    });

                    await new Promise((resolve, reject) => {
                        this.db.run("COMMIT", function (error) {
                            if (error) {
                                this.db.run("ROLLBACK");
                                reject(error.errno);
                            } else {
                                resolve(200);
                            }
                        });
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

    DeserealizarFranjas(texto) {
        return texto.split(',').map(item => Number(item.trim())) || [];
    }
}
module.exports = JornadaRepo;