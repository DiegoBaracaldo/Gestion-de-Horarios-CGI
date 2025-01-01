import ProgramaRepo from "../repositorios/ProgramaRepo"

class ProgramaServicio {

    constructor() {

    }

    async ExisteUno(){
      console.log("buscando existencia...");
      try {
        return await window.electron.AtLeastOnePrograma();
      } catch (error) {
        console.log("error en servicio programa por: ", error);
        return 0;
      }
    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllProgramas();
        } catch (error) {
          console.log("error en crud progrmas por: ", error);
          return [];
        }
    }

    async GuardarPrograma(programa){
      console.log("guardando programa...");
      try {
        return await window.electron.SaveNewPrograma(programa);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
        return 0;
      }
    }

    async CargarPrograma(id){
      console.log("Cargando programa...");
      try {
        return await window.electron.GetProgramaByID(id);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
        return {};
      }
    }

    async ActualizarPrograma(idViejo, programa){
      console.log("Actualizando programa...");
      try {
        return await window.electron.SavePrograma(idViejo, programa);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
        return 0;
      }
    }
  
    async EliminarPrograma(listaIDs){
      console.log("Eliminando programa...");
      try {
        return await window.electron.RemovePrograma(listaIDs);
      } catch (error) {
        console.log("error en servicio programa por: ", error);
        return 0;
      }
    }
}


export default ProgramaServicio;