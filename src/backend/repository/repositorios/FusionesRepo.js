class FusionesRepo {

    constructor(db) {
        this.db = db;
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
                try {
                    this.db.run("BEGIN TRANSACTION");
                    const { idPrograma, idHuesped, idAnfitrion } = fusion;

                    const queryAdd = `
                    INSERT INTO fusiones (idPrograma, idHuesped, idAnfitrion) values(?, ?, ?);`

                    const queryDeleteFranjas = `
                    DELETE FROM franjas WHERE idGrupo = ?;`

                    const queryDeletePiscina = `
                    DELETE FROM piscinaCompetencias WHERE idGrupo = ?;`

                    await this.db.run(queryDeleteFranjas, [idHuesped], function (error) {
                        if (error) reject(error);
                        else resolve();
                    });

                    await this.db.run(queryDeletePiscina, [idHuesped], function (error) {
                        if (error) reject(error);
                        else resolve();
                    });

                    await this.db.run(queryAdd, [idPrograma, idHuesped, idAnfitrion], function (error) {
                        if (error) reject(error);
                        else resolve();
                    });
                    
                    //Confirmar que todo fue exitoso
                    await this.db.run("COMMIT",  function(error) {
                        if (error) {
                            this.db.run("ROLLBACK");
                            reject(error.errno);
                        } else {
                            //200 Significa guardado correcto, debe interpretarse en el render
                            resolve(200);
                        }
                    });

                } catch (error) {
                    //Error en cualquier parte de las transacciones
                    await this.db.run("ROLLBACK");
                    reject(error.errno);
                }
            });
        });
    }

}

module.exports = FusionesRepo;