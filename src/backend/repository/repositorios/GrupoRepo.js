
class GrupoRepo {

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
            const query = "SELECT EXISTS(SELECT 1 FROM grupos LIMIT 1) AS hasRecords";
            this.db.get(query, [], (err, fila) => {
                if (err){
                    reject(err.errno);
                } 
                else resolve(fila.hasRecords);
            });
        });
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query =
                "SELECT " +
                "grupos.*, " +
                "jornadas.tipo AS jornada, " +
                "jornadas.franjaDisponibilidad AS franjaJornada, " +
                "instructores.nombre AS nombreResponsable, " +
                "programas.nombre AS nombrePrograma " +
                "FROM " +
                "grupos " +
                "JOIN " +
                "jornadas ON grupos.idJornada = jornadas.id " +
                "JOIN " +
                "instructores ON grupos.idResponsable = instructores.id " +
                "JOIN " +
                "programas ON grupos.idPrograma = programas.id ";

            this.db.all(query, [], (err, filas) => {
                if (err){
                    reject(err.errno);
                }
                else resolve(filas);
            });
        });
    }

    async GetAllById(arrayIds) {
        return new Promise((resolve, reject) => {
            const placeHolders = arrayIds.map(() => '?').join(', ');

            const query = `
                SELECT * FROM grupos
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

    async GetAllByPool() {
        return new Promise((resolve, reject) => {

            const query =
                `SELECT 
                    grupos.*, 
                    jornadas.tipo AS jornada, 
                    jornadas.franjaDisponibilidad AS franjaJornada, 
                    instructores.nombre AS nombreResponsable, 
                    programas.nombre AS nombrePrograma 
                FROM 
                    grupos 
                JOIN 
                    jornadas ON grupos.idJornada = jornadas.id 
                JOIN 
                    instructores ON grupos.idResponsable = instructores.id 
                JOIN 
                    programas ON grupos.idPrograma = programas.id 
                LEFT JOIN 
                    fusiones ON grupos.id = fusiones.idHuesped 
                WHERE 
                    fusiones.idHuesped IS NULL`;

            this.db.all(query, [], (error, filas) => {
                if (error){
                    reject(error.errno);
                }
                else resolve(filas);
            });
        });
    }

    async GetById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM grupos WHERE id = ?";
            this.db.get(query, [id], (error, fila) => {
                if (error){
                    reject(error.errno);
                }
                else resolve(fila);
            });
        });
    }

    async SaveNew(grupo) {
        const { id, idPrograma, idResponsable, codigoGrupo, idJornada,
            cantidadAprendices, esCadenaFormacion, trimestreLectivo, fechaInicioTrimestre,
            fechaFinTrimestre } = grupo;
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO grupos " +
                "(id, idPrograma, idResponsable, codigoGrupo, idJornada, cantidadAprendices, esCadenaFormacion, trimestreLectivo, fechaInicioTrimestre, fechaFinTrimestre) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            this.db.run(query,
                [id, idPrograma, idResponsable, codigoGrupo, idJornada,
                    cantidadAprendices, esCadenaFormacion, trimestreLectivo,
                    fechaInicioTrimestre, fechaFinTrimestre],
                function (error) {
                    if (error) {
                        reject(error.errno);
                    } else {
                        resolve(this.changes);
                    }
                });
        });
    }

    async Save(idViejo, grupo) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE grupos SET " +
                "id = ?, idPrograma = ?, " +
                "idResponsable = ?, codigoGrupo = ?, " +
                "idJornada = ?, cantidadAprendices = ?, esCadenaFormacion = ?, " +
                "trimestreLectivo = ?, fechaInicioTrimestre = ?, fechaFinTrimestre = ?" +
                "WHERE id = ?";
            const { id, idPrograma, idResponsable, codigoGrupo, idJornada,
                cantidadAprendices, esCadenaFormacion, trimestreLectivo, fechaInicioTrimestre,
                fechaFinTrimestre } = grupo;

            this.db.serialize(async () => {
                try {
                    await this.ActivarLlavesForaneas();
                    this.db.run(query,
                        [id, idPrograma, idResponsable, codigoGrupo, idJornada,
                            cantidadAprendices, esCadenaFormacion, trimestreLectivo,
                            fechaInicioTrimestre, fechaFinTrimestre, idViejo],
                        function (error) {
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
            const query = "DELETE FROM grupos WHERE id IN (" + placeholders + ")";

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
module.exports = GrupoRepo;