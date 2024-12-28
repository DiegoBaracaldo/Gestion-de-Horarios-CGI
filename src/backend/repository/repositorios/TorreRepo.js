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
         //Se recogen los index para hacer splice a la lista
         const arrayIndex = [];
         torres.forEach((torre, index) => {
             if (idArray.includes(torre.id)) arrayIndex.push(index);
         });
         console.log(arrayIndex);
         arrayIndex.forEach((indexTorre, index) => {
             //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
             indexTorre = indexTorre - index;
             torres.splice(indexTorre, 1);
         });
    }
}
export default TorreRepo;