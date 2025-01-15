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

    async ConfirmPool(){
        return new Promise((resolve, reject) => {
            //Primero se cuenta la cantidad de grupos referenciados en la tabla piscinas
            //si existe al menos una referencia
            //Se usa NOT EXIST ya que se intenta encontrar la cantidad de registros que NO
            //se encutran referenciados en piscinasCompetencias pero si están en grupos.
            //ASí si obtengo cero es que todos están referenciados, si obtengo más, no todos lo están
            const query = `
                SELECT COUNT(g.id) AS cantidad FROM grupos g WHERE NOT EXISTS(
                    SELECT 1 FROM piscinaCompetencias p WHERE p.idGrupo = g.id
                );
            `;
            this.db.get(query, [], (error, respuesta)  => {
                if(error){
                    reject(error.errno);
                }else{
                    resolve(respuesta.cantidad === 0);
                }
            });
        });
    }
}

module.exports = PiscinaRepo;