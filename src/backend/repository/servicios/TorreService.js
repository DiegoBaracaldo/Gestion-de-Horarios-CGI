
class TorreServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("cargando lista de torres...");
        try {
          return await window.electron.GetAllTorres();
        } catch (error) {
          console.log("error en crud torres por: ", error);
          return [];
        }
    }

    async GuardarTorre(nombreTorre){
        console.log("guardando torre...");
        try {
          return await window.electron.SaveNewTorre(nombreTorre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          return 0;
        }
    }

    async CargarTorre(idTorre){
        console.log("Cargando torre...");
        try {
          return await window.electron.GetTorreByID(idTorre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          return {};
        }
    }

    async ActualizarTorre (idViejo, torre){
        console.log("Actualizando torre...");
        try {
          return await window.electron.SaveTorre(idViejo, torre);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          return 0;
        }
    }

    async EliminarTorre(listaIDs){
        console.log("Eliminando torre...");
        try {
          return await window.electron.RemoveTorre(listaIDs);
        } catch (error) {
          console.log("error en servicio torres por: ", error);
          return 0;
        }
    }
}


export default TorreServicio;