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
                try {
                    const insertPromises = agregados.map(agregado => {
                        const idGrupo = agregado.idGrupo;
                        const idCompetencia = agregado.idCompetencia;
                        this.db.run(queryInsert, [idGrupo, idCompetencia], function (error) {
                            if (error) reject(error.errno);
                            else resolve();
                        });
                    });

                    const deletePromises = eliminados.map(eliminado => {
                        const idGrupo = eliminado.idGrupo;
                        const idCompetencia = eliminado.idCompetencia;
                        this.db.run(queryDelete, [idGrupo, idCompetencia], function (error) {
                            if (error) reject(error.errno);
                            else resolve();
                        });
                    });

                    Promise.all([...insertPromises, ...deletePromises])
                        .then(() => {
                            // Si todo va bien, confirmar la transacción
                            this.db.run("COMMIT", function (error) {
                                if (error) {
                                    this.db.run("ROLLBACK"); // Revertir en caso de error al hacer commit
                                    reject(error.errno);
                                } else {
                                    resolve("Cambios guardados correctamente!");
                                }
                            });
                        })
                        .catch(error => {
                            // Si ocurre algún error en cualquiera de las operaciones, revertir la transacción
                            this.db.run("ROLLBACK");
                            reject(error);  // Rechazar la promesa
                        });


                } catch (error) {
                    this.db.run("ROLLBACK"); // Revertir en caso de error inesperado
                    reject(error + ": Error general, no se guardó nada!");
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
}

module.exports = PiscinaRepo;