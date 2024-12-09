import { jornadas } from "../../mocks/MockJornadasRepo";
class JornadaRepo{

    constructor(){

    }

    GetAll(){
        return jornadas;
    }

    GetById(id){
        let jornadaAux = null;
        jornadas.forEach((jornada) => {
            if(jornada.id === id) jornadaAux = jornada;
        });
        return jornadaAux;
    }

    SaveNew(jornada){
        jornadas.push(jornada);
    }

    Save(idViejo, jornada){
        let jornadaViejo = this.GetById(idViejo);
        if(jornadaViejo === null){
            this.SaveNew(jornada);
        }else{
            //actualizar
            let jornadaIndex = jornadas.findIndex(e => e.id === idViejo);
            jornadas[jornadaIndex] = programa;
        }
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray){
        idArray.forEach((id) => {
            jornadas.filter(jornada => jornada.id !== id);
        });
    }
}
export default JornadaRepo;