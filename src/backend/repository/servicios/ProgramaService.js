import ProgramaRepo from "../repositorios/ProgramaRepo"

class ProgramaServicio{

    constructor(){

    }
}

CargarLista(){
    const repo = new ProgramaRepo();
    if(repo.GetAll) return repo.GetAll;
    else return null;
}

export default ProgramaServicio;