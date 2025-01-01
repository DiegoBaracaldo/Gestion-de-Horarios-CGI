
class InstructorServicio {

    constructor() {

    }

    async ExisteUno(){
      console.log("buscando existencia...");
      try {
        return await window.electron.AtLeastOneInstructor();
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
        return 0;
      }
    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllInstructores();
        } catch (error) {
          console.log("error en servicio instructor por: ", error);
          return [];
        }
    }

    async GuardarInstructor(instructor){
      console.log("guardando instructor...");
      try {
        return await window.electron.SaveNewInstructor(instructor);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
        return 0;
      }
    }

    async CargarInstructor(id){
      console.log("Cargando instructor...");
      try {
        return await window.electron.GetInstructorByID(id);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
        return {};
      }
    }

    async ActualizarInstructor(idViejo, instructor){
      console.log("Actualizando instructor...");
      try {
        return await window.electron.SaveInstructor(idViejo, instructor);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
        return 0;
      }
    }

    async EliminarInstructor(listaIDs){
      console.log("Eliminando instructor...");
      try {
        return await window.electron.RemoveInstructor(listaIDs);
      } catch (error) {
        console.log("error en servicio instructor por: ", error);
        return 0;
      }
    }
}


export default InstructorServicio;