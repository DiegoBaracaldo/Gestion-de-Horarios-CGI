
class GrupoServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("Cargando lista...");
        try {
            return await window.electron.GetAllGrupos();
        } catch (error) {
            console.log("Error en grupoService por: ", error);
            return [];
        }
    }

    async GuardarGrupo(grupo){
        console.log("guardando grupo...");
        try {
          return await window.electron.SaveNewGrupo(grupo);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          return 0;
        }
      }
  
      async CargarGrupo(id){
        console.log("Cargando grupo...");
        try {
          return await window.electron.GetGrupoByID(id);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          return {};
        }
      }
  
      async ActualizarGrupo(idViejo, grupo){
        console.log("Actualizando grupo...");
        try {
          return await window.electron.SaveGrupo(idViejo, grupo);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          return 0;
        }
      }
  
      async EliminarGrupo(listaIDs){
        console.log("Eliminando grupo...");
        try {
          return await window.electron.RemoveGrupo(listaIDs);
        } catch (error) {
          console.log("error en servicio grupo por: ", error);
          return 0;
        }
      }
}


export default GrupoServicio;