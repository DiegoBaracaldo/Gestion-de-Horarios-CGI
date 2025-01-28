
class JornadaServicio {

  constructor() {

  }

  async ExisteUno() {
    try {
      return await window.electron.AtLeastOneJornada();
    } catch (error) {
      console.log("error en servicio jornada por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async CargarLista() {
    try {
      return await window.electron.GetAllJornadas();
    } catch (error) {
      console.log("error en crud jornadas por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async GuardarJornada(jornada) {
    try {
      return await window.electron.SaveNewJornada(jornada);
    } catch (error) {
      console.log("error en servicio jornada por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async CargarJornada(id) {
    try {
      return await window.electron.GetJornadaByID(id);
    } catch (error) {
      console.log("error en servicio jornadas por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async CargarAllFranjas() {
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
    try {
      return await window.electron.SaveJornada(idViejo, jornada);
    } catch (error) {
      console.log("error en servicio jornadas por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }

  async EliminarJornada(listaIDs) {
    try {
      return await window.electron.RemoveJornada(listaIDs);
    } catch (error) {
      console.log("error en servicio jornada por: ", error);
      throw error.message.split(":")[1].trim();
    }
  }
}


export default JornadaServicio;