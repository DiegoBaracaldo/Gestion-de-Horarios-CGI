
class GrupoServicio {

    constructor() {

    }

    async ExisteUno(){
      try {
        return await window.electron.AtLeastOneGrupo();
      } catch (error) {
        console.log("error en servicio grupo por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        try {
            return await window.electron.GetAllGrupos();
        } catch (error) {
            console.log("Error en grupoService por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }

    async CargarGrupos(arrayIds){
      try {
        return await window.electron.GetAllByIdGrupo(arrayIds);
      } catch (error) {
        console.log("error en servicio grupo por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarListaByPool() {
        try {
            return await window.electron.GetAllGruposByPool();
        } catch (error) {
            console.log("Error en grupoService por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }

    async GuardarGrupo(grupo){
        try {
          return await window.electron.SaveNewGrupo(grupo);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          throw error.message.split(":")[1].trim();
        }
      }
  
      async CargarGrupo(id){
        try {
          return await window.electron.GetGrupoByID(id);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          throw error.message.split(":")[1].trim();
        }
      }
  
      async ActualizarGrupo(idViejo, grupo){
        try {
          return await window.electron.SaveGrupo(idViejo, grupo);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          throw error.message.split(":")[1].trim();
        }
      }
  
      async EliminarGrupo(listaIDs){
        try {
          return await window.electron.RemoveGrupo(listaIDs);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          throw error.message.split(":")[1].trim();
        }
      }
}


export default GrupoServicio;