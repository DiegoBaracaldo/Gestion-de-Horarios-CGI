import { competencias } from "../../mocks/MockCompetenciasRepo";

class CompetenciaRepo{

    constructor(){

    }

    GetAll(){
        return competencias;
    }

    GetById(id){
        let CompetenciaAux = null;
        competencias.forEach((Competencia) => {
            if(Competencia.id === id) CompetenciaAux = Competencia;
        });
        return CompetenciaAux;
    }

    SaveNew(Competencia){
        competencias.push(Competencia);
    }

    Save(idViejo, Competencia){
        let CompetenciaViejo = this.GetById(idViejo);
        if(CompetenciaViejo === null){
            this.SaveNew(Competencia);
        }else{
            //actualizar
            let CompetenciaIndex = competencias.findIndex(e => e.id === idViejo);
            competencias[CompetenciaIndex] = Competencia;
        }
    }

    //Se trabaja con array de ids a eliminar.
    Remove(idArray){
        idArray.forEach((id) => {
            competencias.filter(Competencia => Competencia.id !== id);
        });
    }
}
export default CompetenciaRepo;