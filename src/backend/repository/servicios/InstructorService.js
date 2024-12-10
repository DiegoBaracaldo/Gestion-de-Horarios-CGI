import InstructorRepo from "../repositorios/InstructorRepo"

class InstructorServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new InstructorRepo();
        if (repo.GetAll()) return repo.GetAll();
        else return null;
    }
}


export default InstructorServicio;