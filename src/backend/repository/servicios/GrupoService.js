import GrupoRepo from "../repositorios/GrupoRepo"

class GrupoServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new GrupoRepo();
        if (repo.GetAll) return repo.GetAll;
        else return null;
    }
}


export default GrupoServicio;