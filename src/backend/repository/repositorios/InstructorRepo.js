import { Instructores } from "../../mocks/MocksInstructoresRepo";

class InstructorRepo{

    constructor(){

    }

    GetAll(){
        return Instructores;
    }

    GetById(id){
        let InstructorAux = null;
        Instructores.forEach((Instructor) => {
            if(Instructor.id === id) InstructorAux = Instructor;
        });
        return InstructorAux;
    }

    SaveNew(Instructor){
        Instructores.push(Instructor);
    }

    Save(idViejo, Instructor){
        let InstructorViejo = this.GetById(idViejo);
        if(InstructorViejo === null){
            this.SaveNew(Instructor);
        }else{
            //actualizar
            let InstructorIndex = Instructores.findIndex(e => e.id === idViejo);
            Instructores[InstructorIndex] = programa;
        }
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray){
        idArray.forEach((id) => {
            Instructores.filter(Instructor => Instructor.id !== id);
        });
    }
}
export default InstructorRepo;