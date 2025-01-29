class PiscinaServicio {

    constructor() {

    }

    async CargarPiscinas() {
        try {
            return await window.electron.CargarPiscinas();
        } catch (error) {
            console.log("error en servicio piscinas por: ", error);
            throw error;
        }
    }

    async GuardarPiscinas(agregados, eliminados) {
        try {
            return await window.electron.GuardarPiscinas(agregados, eliminados);
        } catch (error) {
            console.log("error en servicio piscinas por: ", error);
            throw error;
        }
    }

    async PiscinasConfirmadas(){
        try {
            return await window.electron.ConfirmarPiscinas();
        } catch (error) {
            console.log("error en servicio piscinas por: ", error);
            throw error;
        }
    }
}

export default PiscinaServicio;