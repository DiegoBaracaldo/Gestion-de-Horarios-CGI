class FranjaServicio {

    constructor() {

    }

    async CargarFranjas() {
        console.log('Cargando franjas...');
        try {
            return await window.electron.GetAllFranjas();
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }

    async ObtenerBloquesComeptencia(idGrupo, idCompetencia) {
        console.log('Obteniendo bloques por competencia ', idCompetencia);
        try {
            return await window.electron.GetBloquesByCompetenciaFranjas(idGrupo, idCompetencia);
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }

    async GuardarHorario(idGrupo, idCompetencia, arrayFranjas) {
        console.log("Guardando los cambios en el horario...");
        try {
            return await window.electron.DeleteAndSaveFranjas(idGrupo, idCompetencia, arrayFranjas);
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error;
        }
    }

    async OcupanciaBloquesGrupo(idGrupo) {
        console.log("Obteniendo la ocupancia de todos los bloques en todas las competencias del grupo");
        try {
            return await window.electron.GetOcupanciaBloquesGrupo(idGrupo);
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error;
        }
    }
}
export default FranjaServicio;