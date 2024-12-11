import { ambientes } from "../../mocks/MockAmbientesRepo";

class AmbienteRepo{

    constructor(){

    }

    GetAll(){
        return ambientes;
    }

    GetById(id){
        let ambienteAux = null;
        ambientes.forEach((ambiente) => {
            if(ambiente.id === id) ambienteAux = ambiente;
        });
        return ambienteAux;
    }

    SaveNew(ambiente){
        ambientes.push(ambiente);
    }

    Save(idViejo, ambiente){
        let ambienteViejo = this.GetById(idViejo);
        if(ambienteViejo === null){
            this.SaveNew(ambiente);
        }else{
            //actualizar
            let ambienteIndex = ambientes.findIndex(e => e.id === idViejo);
            ambientes[ambienteIndex] = ambiente;
        }
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray){
        idArray.forEach((id) => {
            ambientes.filter(ambiente => ambiente.id !== id);
        });
    }
}
export default AmbienteRepo;