class AmbienteServicio {

    constructor() {

    }

    async ExisteUno(){
      try {
        return await window.electron.AtLeastOneAmbiente();
      } catch (error) {
        console.log("error en servicio Ambiente por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        try {
          return await window.electron.GetAllAmbientes();
        } catch (error) {
          console.log("error en ambiente service por: ", error);
          //Devuelve el mensaje dele error deseado
          throw error.message.split(":")[1].trim();
        }
    }

    async GuardarAmbiente(ambiente){
      try {
        return await window.electron.SaveNewAmbiente(ambiente);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarAmbiente(id){
      try {
        return await window.electron.GetAmbienteByID(id);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async CargarAmbientes(arrayIds){
      try {
        return await window.electron.GetAllByIdAmbiente(arrayIds);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async ActualizarAmbiente(idViejo, ambiente){
      try {
        return await window.electron.SaveAmbiente(idViejo, ambiente);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }

    async EliminarAmbiente(listaIDs){
      try {
        return await window.electron.RemoveAmbiente(listaIDs);
      } catch (error) {
        console.log("error en servicio ambiente por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }
}


export default AmbienteServicio;