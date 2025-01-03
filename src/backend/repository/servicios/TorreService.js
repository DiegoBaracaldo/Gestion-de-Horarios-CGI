
class TorreServicio {

    constructor() {

    }

    async ExisteUno(){
      console.log("buscando existencia...");
      try {
        return await window.electron.AtLeastOneTorre();
      } catch (error) {
        console.log("error en servicio torre por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        console.log("cargando lista de torres...");
        try {
          return await window.electron.GetAllTorres();
        } catch (error) {
          console.log("error en crud torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async GuardarTorre(nombreTorre){
        console.log("guardando torre...");
        try {
          return await window.electron.SaveNewTorre(nombreTorre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async CargarTorre(idTorre){
        console.log("Cargando torre...");
        try {
          return await window.electron.GetTorreByID(idTorre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async ActualizarTorre (idViejo, torre){
        console.log("Actualizando torre...");
        try {
          return await window.electron.SaveTorre(idViejo, torre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async EliminarTorre(listaIDs){
        console.log("Eliminando torre...");
        try {
          return await window.electron.RemoveTorre(listaIDs);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }
}


export default TorreServicio;