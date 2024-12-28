import JornadaRepo from "../repositorios/JornadaRepo"

class JornadaServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new JornadaRepo();
        if (repo.GetAll()) return repo.GetAll();
        else return null;
    }

    GuardarJornada(jornada){
        const repo = new JornadaRepo();
        repo.SaveNew(jornada);
    }

    CargarJornada(id){
        const repo = new JornadaRepo();
        return repo.GetById(id);
    }

    ActualizarJornada(idViejo, jornada){
        const repo = new JornadaRepo();
        repo.Save(idViejo, jornada);
    }

    EliminarJornada(listaIDs){
        const repo = new JornadaRepo();
        repo.Remove(listaIDs);
    }
}


export default JornadaServicio;