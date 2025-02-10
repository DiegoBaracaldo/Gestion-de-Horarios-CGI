
class CompetenciaRepo {

    constructor(db) {
        this.db = db;
    }

    async ActivarLlavesForaneas() {
        return new Promise((resolve, reject) => {
            this.db.run("PRAGMA foreign_keys = ON;", function (error) {
                if (error){
                    reject(error);
                } 
                else resolve();
            });
        });
    }

    async AtLeastOne() {
        return new Promise((resolve, reject) => {
            const query = "SELECT EXISTS(SELECT 1 FROM competencias LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if (err){
                    reject(err.errno);
                } 
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAllById(arrayIds) {
        return new Promise((resolve, reject) => {
            const placeHolders = arrayIds.map(() => '?').join(', ');

            const query = `
                SELECT * FROM competencias
                WHERE id IN (${placeHolders});
            `;

            this.db.all(query, arrayIds, (error, filas) => {
                if (error){
                    reject(error.errno);
                } 
                else resolve(filas);
            });
        });
    }

    GetAllByIdPrograma(idPrograma) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM competencias WHERE idPrograma = ?";
            this.db.all(query, [idPrograma], (error, filas) => {
                if (error){
                    reject(error.errno);
                } 
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM competencias WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error){
                    reject(error.errno);
                }
                else resolve(fila);
            });
        });
    }

    async GetByPool(idGrupo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.* FROM competencias c
                JOIN piscinaCompetencias p ON p.idCompetencia = c.id
                WHERE p.idGrupo = ?
            `;
            this.db.all(query, [idGrupo], (error, competencias) => {
                if (error){
                    reject(error.errno);
                } 
                else resolve(competencias);
            });
        });
    }

    async SaveNew(competencia) {
        const { id, idPrograma, descripcion, horasRequeridas } = competencia;
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO competencias " +
                "(id, idPrograma, descripcion, horasRequeridas) " +
                "VALUES (?, ?, ?, ?)";

            this.db.run(query, [id, idPrograma, descripcion, horasRequeridas], function (error) {
                if (error) {
                    reject(error.errno);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    async Save(idViejo, competencia) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE competencias SET " +
                "id = ?, " +
                "idPrograma = ?, descripcion = ?, " +
                "horasRequeridas = ?" +
                "WHERE id = ?";
            const { id, idPrograma, descripcion, horasRequeridas } = competencia; // Desestructuración del objeto torre

            this.db.serialize(async () => {
                try {
                    await this.ActivarLlavesForaneas();
                    this.db.run(query, [id, idPrograma, descripcion, horasRequeridas, idViejo], function (error) {
                        if (error){
                            reject(error.errno);
                        } 
                        else resolve(this.changes); // Devuelve el número de filas modificadas
                    });
                } catch (error) {
                    reject(error.errno);
                }
            });
        });
    }

    //Se trabaja con array de ids a eliminar.
    async Remove(idArray) {
        return new Promise((resolve, reject) => {

            // Convertir el array de ids en una cadena de ? separada por comas para la consulta SQL
            const placeholders = idArray.map(() => '?').join(', ');
            const query = "DELETE FROM competencias WHERE id IN (" + placeholders + ")";

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
}
module.exports = CompetenciaRepo;