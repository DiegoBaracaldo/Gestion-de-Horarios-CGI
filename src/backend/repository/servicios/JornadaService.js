import JornadaRepo from "../repositorios/JornadaRepo"

class JornadaServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new JornadaRepo();
        if (repo.GetAll) return repo.GetAll;
        else return null;
    }
}


export default JornadaServicio;