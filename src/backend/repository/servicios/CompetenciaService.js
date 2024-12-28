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

    CargarCompetencia(id) {
        const repo = new CompetenciaRepo();
        return repo.GetById(id);
    }

    ActualizarCompetencia(idViejo, competencia){
        const repo = new CompetenciaRepo();
        return repo.Save(idViejo, competencia);
    }

    EliminarCompetencia(listaIDs){
        const repo = new CompetenciaRepo();
        repo.Remove(listaIDs);
    }
}


export default CompetenciaServicio;