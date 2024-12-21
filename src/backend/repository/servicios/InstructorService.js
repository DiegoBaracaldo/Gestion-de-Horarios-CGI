import InstructorRepo from "../repositorios/InstructorRepo"

class InstructorServicio {

    constructor() {

    }

    CargarLista() {
        const repo = new InstructorRepo();
        if (repo.GetAll()) return repo.GetAll();
        else return null;
    }

    GuardarInstructor(instructor){
        const repo = new InstructorRepo();
        repo.SaveNew(instructor);
    }
}


export default InstructorServicio;