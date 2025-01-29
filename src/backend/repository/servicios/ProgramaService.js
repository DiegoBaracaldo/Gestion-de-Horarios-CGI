
class ProgramaServicio {

    constructor() {

    }

    async ExisteUno(){
      try {
        return await window.electron.AtLeastOnePrograma();
      } catch (error) {
        console.log("error en servicio programa por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        try {
          //throw new Error("error: Error intensionado");
          return await window.electron.GetAllProgramas();
        } catch (error) {
          console.log("error en crud progrmas por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async GuardarPrograma(programa){
      try {
        return await window.electron.SaveNewPrograma(programa);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarPrograma(id){
      try {
        return await window.electron.GetProgramaByID(id);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async ActualizarPrograma(idViejo, programa){
      try {
        return await window.electron.SavePrograma(idViejo, programa);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }
  
    async EliminarPrograma(listaIDs){
      try {
        return await window.electron.RemovePrograma(listaIDs);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }
}


export default ProgramaServicio;