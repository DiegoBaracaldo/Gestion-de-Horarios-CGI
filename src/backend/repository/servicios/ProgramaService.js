import ProgramaRepo from "../repositorios/ProgramaRepo"

class ProgramaServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new ProgramaRepo();
        return repo.GetAll();
    }
}


export default ProgramaServicio;