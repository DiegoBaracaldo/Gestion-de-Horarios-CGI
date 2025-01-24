class CompetenciaServicio {

    constructor() {

    }

    async ExisteUno(){
      console.log("buscando existencia...");
      try {
        return await window.electron.AtLeastOneCompetencia();
      } catch (error) {
        console.log("error en servicio Competencia por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista(idPrograma) {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllCompetencias(idPrograma);
        } catch (error) {
          console.log("error en servicio competencias por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async CargarListaSegunPiscina(idGrupo){
      console.log("Cargando lista de competencias según piscina...");
      try {
        return await window.electron.GetAllByPoolCompetencias(idGrupo);
      } catch (error) {
        console.log("error en servicio competencias por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async GuardarCompetencia(competencia){
      console.log("guardando competencia...");
      try {
        return await window.electron.SaveNewCompetencia(competencia);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarCompetencia(id){
      console.log("Cargando competencia...");
      try {
        return await window.electron.GetCompetenciaByID(id);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async ActualizarCompetencia(idViejo, competencia){
      console.log("Actualizando competencia...");
      try {
        return await window.electron.SaveCompetencia(idViejo, competencia);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async EliminarCompetencia(listaIDs){
      console.log("Eliminando competencia...");
      try {
        return await window.electron.RemoveCompetencia(listaIDs);
      } catch (error) {
        console.log("error en servicio competencia por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }
}


export default CompetenciaServicio;