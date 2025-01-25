class FranjaServicio{

    constructor(){

    }

   async  CargarFranjas(){
        console.log('Cargando franjas...');
        try {
            return await window.electron.GetAllFranjas();
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
              throw error.message.split(":")[1].trim();
        }
    }

    async ObtenerBloquesComeptencia(idGrupo, idCompetencia){
        console.log('Obteniendo bloques por competencia ', idCompetencia);
        try {
            const respuesta = await window.electron.GetBloquesByCompetenciaFranjas(idGrupo, idCompetencia);
            // console.log("Los bloques son: " + Array.isArray(respuesta));
            return respuesta;
        } catch (error) {
            console.log("error en servicio franjas por: ", error);
              throw error.message.split(":")[1].trim();
        }
    }
}
export default FranjaServicio;