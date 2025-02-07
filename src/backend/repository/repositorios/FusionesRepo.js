class FusionesRepo {

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


    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM fusiones";
            this.db.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    async SaveNew(fusion) {
        return new Promise((resolve, reject) => {
            this.db.serialize(async () => {
                const { idPrograma, idHuesped, idAnfitrion } = fusion;

                const queryAdd = `
                INSERT INTO fusiones (idPrograma, idHuesped, idAnfitrion) values(?, ?, ?);`

                const queryDeleteFranjas = `
                DELETE FROM franjas WHERE idGrupo = ?;`

                const queryDeletePiscina = `
                DELETE FROM piscinaCompetencias WHERE idGrupo = ?;`

                const runQuery = (query, params) => {
                    return new Promise((resolve, reject) => {
                        this.bd.run(query, params, function (error) {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        });
                    });
                }

                this.db.serialize(async () => {
                    try {
                        this.db.run("BEGIN TRANSACTION");

                        await this.ActivarLlavesForaneas();

                        await runQuery(queryDeleteFranjas, [idHuesped]);

                        await runQuery(queryDeletePiscina, [idHuesped]);

                        await runQuery(queryAdd, [idPrograma, idHuesped, idAnfitrion]);

                        //Confirmar que todo fue exitoso
                        await runQuery("COMMIT", []);

                        resolve(200);
                    } catch (errorCatch) {
                        //Error en cualquier parte de las transacciones
                        const respuestaRollback =
                            await new Promise((resolve, reject) => {
                                this.db.run("ROLLBACK", function (error) {
                                    if (error) reject(902);
                                    else resolve(errorCatch.errno);
                                });
                            });
                        reject(respuestaRollback);
                    }
                });
            });
        });
    }

    async Remove(idHuesped, idAnfitrion) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM fusiones 
            WHERE idHuesped = ? AND idAnfitrion = ?;`

            this.db.serialize(async () => {
                try {
                    await this.ActivarLlavesForaneas();
                    this.db.run(query, [idHuesped, idAnfitrion], function (error) {
                        if (error) reject(error.errno);
                        else resolve(200);
                    });
                } catch (error) {
                    reject(error.errno);
                }
            });
        });
    }
}

module.exports = FusionesRepo;