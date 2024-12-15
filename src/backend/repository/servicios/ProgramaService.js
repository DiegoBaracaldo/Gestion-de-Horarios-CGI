import ProgramaRepo from "../repositorios/ProgramaRepo"

class ProgramaServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new ProgramaRepo();
        return repo.GetAll();
    }

    GuardarPrograma(programa){
        const repo = new ProgramaRepo();
        repo.SaveNew(programa);
    }
}


export default ProgramaServicio;