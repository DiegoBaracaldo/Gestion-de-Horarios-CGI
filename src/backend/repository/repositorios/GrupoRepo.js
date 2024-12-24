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
        idArray.forEach((id) => {
            grupos.filter(grupo => grupo.id !== id);
        });
    }
}
export default GrupoRepo;