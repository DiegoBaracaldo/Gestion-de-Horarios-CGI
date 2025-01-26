
class InstructorServicio {

    constructor() {

    }

    async ExisteUno(){
      console.log("buscando existencia...");
      try {
        return await window.electron.AtLeastOneInstructor();
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          const respuesta = await window.electron.GetAllInstructores();
          return respuesta;
        } catch (error) {
          console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async GuardarInstructor(instructor){
      console.log("guardando instructor...");
      try {
        return await window.electron.SaveNewInstructor(instructor);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarInstructor(id){
      console.log("Cargando instructor...");
      try {
        return await window.electron.GetInstructorByID(id);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async ActualizarInstructor(idViejo, instructor){
      console.log("Actualizando instructor...");
      try {
        return await window.electron.SaveInstructor(idViejo, instructor);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async EliminarInstructor(listaIDs){
      console.log("Eliminando instructor...");
      try {
        return await window.electron.RemoveInstructor(listaIDs);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }
}


export default InstructorServicio;