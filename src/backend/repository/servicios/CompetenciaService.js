import CompetenciaRepo from "../repositorios/CompetenciaRepo"

class CompetenciaServicio {

    constructor() {

    }

    CargarLista(idPrograma) {
        const repo = new CompetenciaRepo();
        if (repo.GetAllByIdPrograma(idPrograma)) return repo.GetAllByIdPrograma(idPrograma);
        else return null;
    }

    GuardarCompetencia(competencia) {
        const repo = new CompetenciaRepo();
        repo.SaveNew(competencia);
    }
}


export default CompetenciaServicio;