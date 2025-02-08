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
                else resolve(fila.valor.toString());
            });
        });
    }
    
    async TriggerHorarioFalse(){
        return new Promise((resolve, reject) => {
            const query =`
            UPDATE datos SET valor = 'false' WHERE clave = 'horarioCambiado';
            `;
            this.db.run(query, [], function(error){
                if(error) reject(error.errno);
                else resolve(true);
            });
        });
    }
}
module.exports = HorarioPDFRepo;