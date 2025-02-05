class CompetenciaServicio {

    constructor() {

    }

    async ExisteUno(){
      try {
        return await window.electron.AtLeastOneCompetencia();
      } catch (error) {
        console.log("error en servicio Competencia por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista(idPrograma) {
        try {
          return await window.electron.GetAllCompetencias(idPrograma);
        } catch (error) {
          console.log("error en servicio competencias por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async CargarCompetencias(arrayIds){
      try {
        return await window.electron.GetAllByIdCompetencia(arrayIds);
      } catch (error) {
        console.log("error en servicio competencias por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarListaSegunPiscina(idGrupo){
      try {
        return await window.electron.GetAllByPoolCompetencias(idGrupo);
      } catch (error) {
        console.log("error en servicio competencias por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async GuardarCompetencia(competencia){
      try {
        return await window.electron.SaveNewCompetencia(competencia);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarCompetencia(id){
      try {
        return await window.electron.GetCompetenciaByID(id);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async ActualizarCompetencia(idViejo, competencia){
      try {
        return await window.electron.SaveCompetencia(idViejo, competencia);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async EliminarCompetencia(listaIDs){
      try {
        return await window.electron.RemoveCompetencia(listaIDs);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }
}


export default CompetenciaServicio;