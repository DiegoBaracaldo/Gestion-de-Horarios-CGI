import { programasAcademicos } from "../../mocks/MockProgramasRepo";

class ProgramaRepo {

    constructor() {

    }

    GetAll() {
        return programasAcademicos;
    }

    GetById(id) {
        let programaAux = null;
        programasAcademicos.forEach((programa) => {
            if (programa.id === id) programaAux = programa;
        });
        return programaAux;
    }

    SaveNew(programa) {
        programasAcademicos.push(programa);
    }

    Save(idViejo, programa) {
        //actualizar
        let programaIndex = programasAcademicos.findIndex(e => e.id === idViejo);
        programasAcademicos[programaIndex] = programa;
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray) {
        idArray.forEach((id) => {
            programasAcademicos.filter(producto => producto.id !== id);
        });
    }
}
export default ProgramaRepo;