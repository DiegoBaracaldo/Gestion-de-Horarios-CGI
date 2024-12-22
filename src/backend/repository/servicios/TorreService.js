import TorreRepo from "../repositorios/TorreRepo"

class TorreServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new TorreRepo();
        if (repo.GetAll()) return repo.GetAll();
        else return null;
    }

    GuardarTorre(torre){
        const repo = new TorreRepo();
        repo.SaveNew(torre);
    }

    CargarTorre(idTorre){
        const repo = new TorreRepo();
        return repo.GetById(idTorre);
    }
}


export default TorreServicio;