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

    CargarInstructor(idIstructor){
        const repo = new InstructorRepo();
        return repo.GetById(idIstructor);
    }
}


export default InstructorServicio;