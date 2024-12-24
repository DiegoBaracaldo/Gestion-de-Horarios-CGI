import { instructores } from "../../mocks/MockInstructoresRepo";

class InstructorRepo {

    constructor() {

    }

    GetAll() {
        return instructores;
    }

    GetById(id) {
        let InstructorAux = null;
        instructores.forEach((Instructor) => {
            if (Instructor.id === id) InstructorAux = Instructor;
        });
        return InstructorAux;
    }

    SaveNew(Instructor) {
        instructores.push(Instructor);
    }

    Save(idViejo, Instructor) {
        //actualizar
        let InstructorIndex = instructores.findIndex(e => e.id === idViejo);
        instructores[InstructorIndex] = Instructor;
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray) {
        idArray.forEach((id) => {
            instructores.filter(Instructor => Instructor.id !== id);
        });
    }
}
export default InstructorRepo;