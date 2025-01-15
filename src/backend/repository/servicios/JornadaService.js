
class JornadaServicio {

  constructor() {

  }

  async ExisteUno() {
    console.log("buscando existencia...");
    try {
      return await window.electron.AtLeastOneJornada();
    } catch (error) {
      console.log("error en servicio jornada por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async CargarLista() {
    console.log("cargando lista...");
    try {
      return await window.electron.GetAllJornadas();
    } catch (error) {
      console.log("error en crud jornadas por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async GuardarJornada(jornada) {
    console.log("guardando jornada...");
    try {
      return await window.electron.SaveNewJornada(jornada);
    } catch (error) {
      console.log("error en servicio jornada por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async CargarJornada(id) {
    console.log("Cargando jornada...");
    try {
      return await window.electron.GetJornadaByID(id);
    } catch (error) {
      console.log("error en servicio jornadas por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async CargarAllFranjas() {
    console.log('Obteniendo todas las franjas horarias de las jornadas...');
    try {
      const respuesta = await window.electron.GetAllFranjasJornada();
      if(Array.isArray(respuesta) && respuesta.length > 0){
        const listaGlobalString = respuesta.map(listaFranjas => {
          return listaFranjas.franjaDisponibilidad;
        }).toString();
        const listaFranjasNum = listaGlobalString.match(/\d+/g).map(Number);
        return (listaFranjasNum);  
      }else{
        return [];
      }
    } catch (error) {
      console.log("error en servicio jornadas por: ", error);
      throw error.message;
    }
  }

  async ActualizarJornada(idViejo, jornada) {
    console.log("Actualizando jornada...");
    try {
      return await window.electron.SaveJornada(idViejo, jornada);
    } catch (error) {
      console.log("error en servicio jornadas por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async EliminarJornada(listaIDs) {
    console.log("Eliminando jornada...");
    try {
      return await window.electron.RemoveJornada(listaIDs);
    } catch (error) {
      console.log("error en servicio jornada por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }
}


export default JornadaServicio;