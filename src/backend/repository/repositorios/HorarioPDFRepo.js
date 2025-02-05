const AmbienteRepo = require("./AmbienteRepo");
const CompetenciaRepo = require("./CompetenciaRepo");
const GrupoRepo = require("./GrupoRepo");

class HorarioPDFRepo {

    constructor(db) {
        this.db = db;
    }

    async GetByClave(clave) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT valor FROM datos WHERE clave = ?;`;

            this.db.get(query, [clave], function (error, fila) {
                if (error) reject(error.errno);
                else resolve(fila.valor);
            });
        });
    }
}
module.exports = HorarioPDFRepo;