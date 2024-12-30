class CompetenciaRepo {

    constructor(db) {
        this.db = db;
    }

    GetAllByIdPrograma(idPrograma) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM competencias WHERE idPrograma = ?";
            this.db.all(query, [idPrograma], (err, filas) => {
                if(err) reject(err);
                else resolve(filas);
            });
        });
    }

    // GetById(id) {
    //     let CompetenciaAux = null;
    //     competencias.forEach((Competencia) => {
    //         if (Competencia.id === id) CompetenciaAux = Competencia;
    //     });
    //     return CompetenciaAux;
    // }

    // SaveNew(Competencia) {
    //     competencias.push(Competencia);
    // }

    // Save(idViejo, Competencia) {
    //     //actualizar
    //     let CompetenciaIndex = competencias.findIndex(e => e.id === idViejo);
    //     competencias[CompetenciaIndex] = Competencia;
    // }

    // //Se trabaja con array de ids a eliminar.
    // Remove(idArray) {
    //     //Se recogen los index para hacer splice a la lista
    //     const arrayIndex = [];
    //     competencias.forEach((competencia, index) => {
    //         if (idArray.includes(competencia.id)) arrayIndex.push(index);
    //     });
    //     console.log(arrayIndex);
    //     arrayIndex.forEach((indexCompetencia, index) => {
    //         //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
    //         indexCompetencia = indexCompetencia - index;
    //         competencias.splice(indexCompetencia, 1);
    //     });
    // }
}
module.exports = CompetenciaRepo;