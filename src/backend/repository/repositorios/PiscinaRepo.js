class PiscinaRepo{

    constructor(db){
        this.db = db;
    }

    async SavePool(gruposArray){
        return new Promise((resolve, reject) => {
            // Iniciar una transacción
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION");
    
                // Iterar sobre las jornadas y hacer los INSERT correspondientes
                const query = "INSERT INTO piscinaCompetencias (idGrupo, idCompetencia) VALUES (?, ?)";
                
                try {
                    for (const grupo of gruposArray) {
                        const idGrupo = grupo.id;
                        for (const competencia of grupo.competencias) {
                            const idCompetencia = competencia.id;
    
                            this.db.run(query, [idGrupo, idCompetencia], function (error) {
                                if (error) {
                                    // Si hay un error, revertir la transacción
                                    this.db.run("ROLLBACK");
                                    reject(error.errno);
                                }
                            });
                        }
                    }
    
                    // Si todo va bien, confirmar la transacción
                    this.db.run("COMMIT", function (error) {
                        if (error) {
                            this.db.run("ROLLBACK"); // Revertir en caso de error al hacer commit
                            reject(error.errno);
                        } else {
                            resolve("Piscinas de competencias guardadas correctamente.");
                        }
                    });
                } catch (error) {
                    this.db.run("ROLLBACK"); // Revertir en caso de error inesperado
                    reject(error + ": Error general, no se guardó nada!");
                }
            });
        });
    }

    async GetAll(){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM piscinaCompetencias";
            this.db.all(query, [], (error, filas) => {
                if(error) reject(error.errno);
                else resolve(filas);
            });
        });
    }
}

module.exports = PiscinaRepo;