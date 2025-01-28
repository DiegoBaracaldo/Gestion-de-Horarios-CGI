
class TorreServicio {

    constructor() {

    }

    async ExisteUno(){
      try {
        return await window.electron.AtLeastOneTorre();
      } catch (error) {
        console.log("error en servicio torre por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        try {
          return await window.electron.GetAllTorres();
        } catch (error) {
          console.log("error en crud torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async GuardarTorre(nombreTorre){
        try {
          return await window.electron.SaveNewTorre(nombreTorre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async CargarTorre(idTorre){
        try {
          return await window.electron.GetTorreByID(idTorre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async ActualizarTorre (idViejo, torre){
        try {
          return await window.electron.SaveTorre(idViejo, torre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async EliminarTorre(listaIDs){
        try {
          return await window.electron.RemoveTorre(listaIDs);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }
}


export default TorreServicio;