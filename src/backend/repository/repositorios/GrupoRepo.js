import { grupos } from "../../mocks/MockGruposRepo";

class GrupoRepo {

    constructor() {

    }

    GetAll() {
        return grupos;
    }

    GetById(id) {
        let grupoAux = null;
        grupos.forEach((grupo) => {
            if (grupo.id === id) grupoAux = grupo;
        });
        return grupoAux;
    }

    SaveNew(grupo) {
        grupos.push(grupo);
    }

    Save(idViejo, grupo) {
        //actualizar
        let grupoIndex = grupos.findIndex(e => e.id === idViejo);
        grupos[grupoIndex] = grupo;
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray) {
         //Se recogen los index para hacer splice a la lista
         const arrayIndex = [];
         grupos.forEach((grupo, index) => {
             if (idArray.includes(grupo.id)) arrayIndex.push(index);
         });
         console.log(arrayIndex);
         arrayIndex.forEach((indexGrupo, index) => {
             //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
             indexGrupo = indexGrupo - index;
             grupos.splice(indexGrupo, 1);
         });
    }
}
export default GrupoRepo;