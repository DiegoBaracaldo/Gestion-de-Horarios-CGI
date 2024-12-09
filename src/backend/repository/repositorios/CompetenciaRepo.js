import { Competencias } from "../../mocks/MocksCompetenciasRepo";

class CompetenciaRepo{

    constructor(){

    }

    GetAll(){
        return Competencias;
    }

    GetById(id){
        let CompetenciaAux = null;
        Competencias.forEach((Competencia) => {
            if(Competencia.id === id) CompetenciaAux = Competencia;
        });
        return CompetenciaAux;
    }

    SaveNew(Competencia){
        Competencias.push(Competencia);
    }

    Save(idViejo, Competencia){
        let CompetenciaViejo = this.GetById(idViejo);
        if(CompetenciaViejo === null){
            this.SaveNew(Competencia);
        }else{
            //actualizar
            let CompetenciaIndex = Competencias.findIndex(e => e.id === idViejo);
            Competencias[CompetenciaIndex] = programa;
        }
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray){
        idArray.forEach((id) => {
            Competencias.filter(Competencia => Competencia.id !== id);
        });
    }
}
export default CompetenciaRepo;