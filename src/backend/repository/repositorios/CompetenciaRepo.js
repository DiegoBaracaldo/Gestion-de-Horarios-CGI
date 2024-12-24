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
        idArray.forEach((id) => {
            competencias.filter(Competencia => Competencia.id !== id);
        });
    }
}
export default CompetenciaRepo;