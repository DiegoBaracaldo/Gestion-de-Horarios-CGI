class PiscinaServicio {

    constructor() {

    }

    async CargarPiscinas() {
        console.log("Cargando listas piscina...");
        try {
            return await window.electron.CargarPiscinas();
        } catch (error) {
            console.log("error en servicio piscinas por: ", error);
            throw error;
        }
    }

    async GuardarPiscinas(agregados, eliminados) {
        console.log("Guardando piscinas...");
        try {
            return await window.electron.GuardarPiscinas(agregados, eliminados);
        } catch (error) {
            console.log("error en servicio piscinas por: ", error);
            throw error;
        }
    }

    async PiscinasConfirmadas(){
        console.log("Confirmando piscinas...");
        try {
            return await window.electron.ConfirmarPiscinas();
        } catch (error) {
            console.log("error en servicio piscinas por: ", error);
            throw error;
        }
    }
}

export default PiscinaServicio;