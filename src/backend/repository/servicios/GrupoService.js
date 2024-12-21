import GrupoRepo from "../repositorios/GrupoRepo"

class GrupoServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new GrupoRepo();
        if (repo.GetAll()) return repo.GetAll();
        else return null;
    }

    GuardarGrupo(grupo){
        const repo = new GrupoRepo();
        repo.SaveNew(grupo);
    }
}


export default GrupoServicio;