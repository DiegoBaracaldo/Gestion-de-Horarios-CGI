class AmbienteServicio {

    constructor() {

    }

    async ExisteUno(){
      console.log("buscando existencia...");
      try {
        return await window.electron.AtLeastOneAmbiente();
      } catch (error) {
        console.log("error en servicio Ambiente por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllAmbientes();
        } catch (error) {
          console.log("error en ambiente service por: ", error);
          //Devuelve el mensaje dele error deseado
          throw error.message.split(":")[1].trim();
        }
    }

    async GuardarAmbiente(ambiente){
      console.log("guardando ambiente...");
      try {
        return await window.electron.SaveNewAmbiente(ambiente);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarAmbiente(id){
      console.log("Cargando ambiente...");
      try {
        return await window.electron.GetAmbienteByID(id);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarAmbientes(arrayIds){
      console.log('Cargando ambientes por id');
      try {
        return await window.electron.GetAllByIdAmbiente(arrayIds);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async ActualizarAmbiente(idViejo, ambiente){
      console.log("Actualizando ambiente...");
      try {
        return await window.electron.SaveAmbiente(idViejo, ambiente);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async EliminarAmbiente(listaIDs){
      console.log("Eliminando ambiente...");
      try {
        return await window.electron.RemoveAmbiente(listaIDs);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }
}


export default AmbienteServicio;