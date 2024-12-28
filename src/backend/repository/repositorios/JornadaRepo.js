import { jornadas } from "../../mocks/MockJornadasRepo";
class JornadaRepo {

    constructor() {

    }

    GetAll() {
        return jornadas;
    }

    GetById(id) {
        let jornadaAux = null;
        jornadas.forEach((jornada) => {
            if (jornada.id === id) jornadaAux = jornada;
        });
        return jornadaAux;
    }

    SaveNew(jornada) {
        jornadas.push(jornada);
    }

    Save(idViejo, jornada) {
        //actualizar
        let jornadaIndex = jornadas.findIndex(e => e.id === idViejo);
        jornadas[jornadaIndex] = jornada;
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray) {
         //Se recogen los index para hacer splice a la lista
         const arrayIndex = [];
         jornadas.forEach((jornada, index) => {
             if (idArray.includes(jornada.id)) arrayIndex.push(index);
         });
         console.log(arrayIndex);
         arrayIndex.forEach((indexJornada, index) => {
             //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
             indexJornada = indexJornada - index;
             jornadas.splice(indexJornada, 1);
         });
    }
}
export default JornadaRepo;