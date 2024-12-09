import { programasAcademicos } from "../../mocks/MockProgramasRepo";

class ProgramaRepo{

    constructor(){

    }

    GetAll(){
        return programasAcademicos;
    }

    GetById(id){
        let programaAux = null;
        programasAcademicos.forEach((programa) => {
            if(programa.id === id) programaAux = programa;
        });
        return programaAux;
    }

    SaveNew(programa){
        programasAcademicos.push(programa);
    }

    Save(idViejo, programa){
        let programaViejo = this.GetById(idViejo);
        if(programaViejo === null){
            this.SaveNew(programa);
        }else{
            //actualizar
            return null;
        }
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray){
        idArray.forEach((id) => {
            this.programasListaMock.filter(producto => producto.id !== id);
        });
    }
}
export default ProgramaRepo;