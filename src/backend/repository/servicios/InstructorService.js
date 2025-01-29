
class InstructorServicio {

    constructor() {

    }

    async ExisteUno(){
      try {
        return await window.electron.AtLeastOneInstructor();
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarLista() {
        try {
          const respuesta = await window.electron.GetAllInstructores();
          return respuesta;
        } catch (error) {
          console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
        }
    }

    async GuardarInstructor(instructor){
      try {
        return await window.electron.SaveNewInstructor(instructor);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarInstructor(id){
      try {
        return await window.electron.GetInstructorByID(id);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async CargarInstructores(arrayIds){
      try {
        return await window.electron.GetAllByIdInstructor(arrayIds);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
        throw error.message.split(":")[1].trim();
      }
    }


    async ActualizarInstructor(idViejo, instructor){
      try {
        return await window.electron.SaveInstructor(idViejo, instructor);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }

    async EliminarInstructor(listaIDs){
      try {
        return await window.electron.RemoveInstructor(listaIDs);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
          throw error.message.split(":")[1].trim();
      }
    }
}


export default InstructorServicio;