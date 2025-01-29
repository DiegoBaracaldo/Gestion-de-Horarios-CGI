class FranjaServicio {

    constructor() {

    }

    async CargarFranjas() {
        try {
            return await window.electron.GetAllFranjas();
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }

    async ObtenerBloquesComeptencia(idGrupo, idCompetencia) {
        try {
            return await window.electron.GetBloquesByCompetenciaFranjas(idGrupo, idCompetencia);
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }

    async GuardarHorario(idGrupo, idCompetencia, arrayFranjas) {
        try {
            return await window.electron.DeleteAndSaveFranjas(idGrupo, idCompetencia, arrayFranjas);
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error;
        }
    }

    async OcupanciaBloquesGrupo(idGrupo) {
        try {
            return await window.electron.GetOcupanciaBloquesGrupo(idGrupo);
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error;
        }
    }

    async ObtenerFranjasCompetenciaGrupo(idGrupo, idCompetencia){
        try {
            return await window.electron.GetFranjasByCompetenciaAndGrupo(idGrupo, idCompetencia);
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
            throw error;
        }
    }
}
export default FranjaServicio;