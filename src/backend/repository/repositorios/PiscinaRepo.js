class PiscinaRepo {

    constructor(db) {
        this.db = db;
    }

    async SavePool(agregados, eliminados) {
        return new Promise((resolve, reject) => {
            // Iniciar una transacción
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION");

                const queryInsert = "INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (?, ?)";
                const queryDelete = "DELETE from piscinaCompetencias WHERE idGrupo = ? AND idCompetencia = ?";
                const queryDeleteFranjas = `
                    DELETE FROM franjas WHERE idCompetencia = ? AND idGrupo = ?;`;

                const runQuery = (query, params) => {
                    return new Promise((resolve, reject) => {
                        this.db.run(query, params, function (error) {
                            if (error) {
                                reject(error.errno)
                            } else {
                                resolve();
                            }
                        });
                    });
                }

                const insertPromises = agregados.map(agregado => {
                    return runQuery(queryInsert, [agregado.idGrupo, agregado.idCompetencia]);
                });

                const deletePromises = eliminados.map(eliminado => {
                    return runQuery(queryDelete, [eliminado.idGrupo, eliminado.idCompetencia]);
                });

                const deleteFranjasPromises = eliminados.map(eliminado => {
                    return runQuery(queryDeleteFranjas, [eliminado.idCompetencia, eliminado.idGrupo]);
                });

                Promise.all([...insertPromises, ...deletePromises, ...deleteFranjasPromises])
                    .then(() => {
                        //Si todo sale bien
                        this.db.run("COMMIT", function (error) {
                            if (error) {
                                //Revertir en caso de error con el commit
                                this.db.run("ROLLBACK");
                                reject(error.errno);
                            } else {
                                resolve("Cambios Guardados Correctamente!");
                            }
                        });
                    })
                    .catch(error => {
                        // Si error en alguna de las operaciones
                        this.db.run("ROLLBACK");
                        reject(error.errno);
                    });
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM piscinaCompetencias";
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    async ConfirmPool() {
        return new Promise((resolve, reject) => {
            //Primero se cuenta la cantidad de grupos referenciados en la tabla piscinas
            //si existe al menos una referencia
            //Se usa NOT EXIST ya que se intenta encontrar la cantidad de registros que NO
            //se encutran referenciados en piscinasCompetencias pero si están en grupos.
            //ASí si obtengo cero es que todos están referenciados, si obtengo más, no todos lo están
            const query = `
                SELECT COUNT(g.id) AS cantidad 
                FROM grupos g 
                WHERE 
                    NOT EXISTS (
                        SELECT 1 
                        FROM piscinaCompetencias p 
                        WHERE p.idGrupo = g.id
                    )
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM fusiones f 
                        WHERE f.idHuesped = g.id
                    );
            `;
            this.db.get(query, [], (error, respuesta) => {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(respuesta.cantidad === 0);
                }
            });
        });
    }
}

module.exports = PiscinaRepo;