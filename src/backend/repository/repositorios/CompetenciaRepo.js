import { competencias } from "../../mocks/MockCompetenciasRepo";

class CompetenciaRepo {

    constructor() {

    }

    GetAllByIdPrograma(idPrograma) {
        const listaAux = [];
        competencias.forEach((competenciaObj) => {
            if (competenciaObj.idPrograma === idPrograma) listaAux.push(competenciaObj);
        });
        return listaAux;
    }

    GetById(id) {
        let CompetenciaAux = null;
        competencias.forEach((Competencia) => {
            if (Competencia.id === id) CompetenciaAux = Competencia;
        });
        return CompetenciaAux;
    }

    SaveNew(Competencia) {
        competencias.push(Competencia);
    }

    Save(idViejo, Competencia) {
        //actualizar
        let CompetenciaIndex = competencias.findIndex(e => e.id === idViejo);
        competencias[CompetenciaIndex] = Competencia;
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray) {
        //Se recogen los index para hacer splice a la lista
        const arrayIndex = [];
        competencias.forEach((competencia, index) => {
            if (idArray.includes(competencia.id)) arrayIndex.push(index);
        });
        console.log(arrayIndex);
        arrayIndex.forEach((indexCompetencia, index) => {
            //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
            indexCompetencia = indexCompetencia - index;
            competencias.splice(indexCompetencia, 1);
        });
    }
}
export default CompetenciaRepo;