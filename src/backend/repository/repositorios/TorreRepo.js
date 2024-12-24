import { torres } from "../../mocks/MockTorresRepo";

class TorreRepo{

    constructor(){

    }

    GetAll(){
        return torres;
    }

    GetById(id){
        let torreAux = null;
        torres.forEach((torre) => {
            if(torre.id === id) torreAux = torre;
        });
        return torreAux;
    }

    SaveNew(torre){
        torres.push(torre);
    }

    Save(idViejo, torre){
            //actualizar
            let torreIndex = torres.findIndex(e => e.id === idViejo);
            torres[torreIndex] = torre;
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray){
        idArray.forEach((id) => {
            torres.filter(torre => torre.id !== id);
        });
    }
}
export default TorreRepo;