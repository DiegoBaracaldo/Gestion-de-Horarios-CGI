class FusionesServicio {

    constructor() {

    }

    async CargarLista() {
        try {
            return await window.electron.GetAllFusiones();
        } catch (error) {
            console.log("Error en fusiones service por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }

    async GuardarFusion(fusion) {
        try {
            return await window.electron.SaveNewFusion(fusion);
        } catch (error) {
            console.log("Error en fusiones service por: ", error);
            throw error.message.split(":")[1].trim();
        }
    }
}

export default FusionesServicio;