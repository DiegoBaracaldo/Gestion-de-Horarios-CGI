class AmbienteServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllAmbientes();
        } catch (error) {
          console.log("error en ambiente service por: ", error);
          return [];
        }
    }

    async GuardarAmbiente(ambiente){
      console.log("guardando ambiente...");
      try {
        return await window.electron.SaveNewAmbiente(ambiente);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        return 0;
      }
    }

    async CargarAmbiente(id){
      console.log("Cargando ambiente...");
      try {
        return await window.electron.GetAmbienteByID(id);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        return {};
      }
    }

    async ActualizarAmbiente(idViejo, ambiente){
      console.log("Actualizando ambiente...");
      try {
        return await window.electron.SaveAmbiente(idViejo, ambiente);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        return 0;
      }
    }

    async EliminarAmbiente(listaIDs){
      console.log("Eliminando ambiente...");
      try {
        return await window.electron.RemoveAmbiente(listaIDs);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        return 0;
      }
    }
}


export default AmbienteServicio;