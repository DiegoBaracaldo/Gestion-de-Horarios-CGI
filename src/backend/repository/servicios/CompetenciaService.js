import CompetenciaRepo from "../repositorios/CompetenciaRepo"

class CompetenciaServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new CompetenciaRepo();
        if (repo.GetAll) return repo.GetAll;
        else return null;
    }
}


export default CompetenciaServicio;