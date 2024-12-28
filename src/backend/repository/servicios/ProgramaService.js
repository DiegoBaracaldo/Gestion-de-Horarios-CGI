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

    CargarPrograma(id){
        const repo = new ProgramaRepo();
        return repo.GetById(id);
    }

    ActualizarPrograma(idViejo, programa){
        const repo = new ProgramaRepo();
        repo.Save(idViejo, programa);
    }
    
    EliminarPrograma(listaIDs){
        const repo = new ProgramaRepo();
        repo.Remove(listaIDs);
    }
}


export default ProgramaServicio;