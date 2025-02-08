class PiscinaRepo {

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


    async SavePool(agregados, eliminados) {
        return new Promise((resolve, reject) => {

            const queryInsert = "INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (?, ?)";
            const queryDelete = "DELETE from piscinaCompetencias WHERE idGrupo = ? AND idCompetencia = ?";
            const queryDeleteFranjas = `
                DELETE FROM franjas WHERE idCompetencia = ? AND idGrupo = ?;`;

            const runQuery = (query, params) => {
                return new Promise((resolve, reject) => {
                    this.db.run(query, params, function (error) {
                        if (error) {
                            reject(error)
                        } else {
                            resolve();
                        }
                    });
                });
            }

            // Iniciar una transacción
            this.db.serialize(async () => {
                try {
                    await this.ActivarLlavesForaneas();

                    this.db.run("BEGIN TRANSACTION");

                    const insertPromises = agregados.map(agregado => {
                        return runQuery(queryInsert, [agregado.idGrupo, agregado.idCompetencia]);
                    });

                    const deletePromises = eliminados.map(eliminado => {
                        return runQuery(queryDelete, [eliminado.idGrupo, eliminado.idCompetencia]);
                    });

                    const deleteFranjasPromises = eliminados.map(eliminado => {
                        return runQuery(queryDeleteFranjas, [eliminado.idCompetencia, eliminado.idGrupo]);
                    });

                    await Promise.all([...insertPromises, ...deletePromises, ...deleteFranjasPromises]);

                    //AQUÍ SE LLEGA SI TODO SALIÓ BIEN
                    await new Promise((resolve, reject) => {
                        this.db.run('COMMIT', [], function (error) {
                            if (error) reject(error);
                            else return resolve(this);
                        });
                    });
                    resolve("Cambios Guardados Correctamente!");

                } catch (error) {
                    // Si error en alguna de las operaciones
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