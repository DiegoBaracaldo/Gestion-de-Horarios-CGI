import TorreRepo from "../repositorios/TorreRepo"

class TorreServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new TorreRepo();
        if (repo.GetAll) return repo.GetAll;
        else return null;
    }
}


export default TorreServicio;