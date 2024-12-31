
class JornadaServicio {

    constructor() {

    }

    async ExisteUno(){
      console.log("buscando existencia...");
      try {
        return await window.electron.AtLeastOneJornada();
      } catch (error) {
        console.log("error en servicio jornada por: ", error);
        return 0;
      }
    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllJornadas();
        } catch (error) {
          console.log("error en crud jornadas por: ", error);
          return [];
        }
    }

    async GuardarJornada(jornada){
      console.log("guardando jornada...");
      try {
        return await window.electron.SaveNewJornada(jornada);
      } catch (error) {
        console.log("error en servicio jornada por: ", error);
        return 0;
      }
    }

    async CargarJornada(id){
      console.log("Cargando jornada...");
      try {
        return await window.electron.GetJornadaByID(id);
      } catch (error) {
        console.log("error en servicio jornadas por: ", error);
        return {};
      }
    }

    async ActualizarJornada(idViejo, jornada){
      console.log("Actualizando jornada...");
      try {
        return await window.electron.SaveJornada(idViejo, jornada);
      } catch (error) {
        console.log("error en servicio jornadas por: ", error);
        return 0;
      }
    }

    async EliminarJornada(listaIDs){
      console.log("Eliminando jornada...");
      try {
        return await window.electron.RemoveJornada(listaIDs);
      } catch (error) {
        console.log("error en servicio jornada por: ", error);
        return 0;
      }
    }
}


export default JornadaServicio;