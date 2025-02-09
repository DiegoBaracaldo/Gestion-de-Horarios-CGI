class HorarioPDFServicio{
    constructor(){

    }

    async EncontrarValor(clave){
        try {
            return await window.electron.GetByClave(clave);
        } catch (error) {
            console.log("error en servicio horarioPDF por: ", error);
              throw error.message.split(":")[1].trim();
        }
    }

    async GuardarPDFsInstructores(arrayPDF){
        try {
            return await window.electron.SavePDFsInstructores(arrayPDF);
        } catch (error) {
            console.log("Error en servicio de horarioPDF por:", error);
            throw error;
        }
    }

    async GuardarPDFsGrupos(arrayPDF){
        try {
            return await window.electron.SavePDFsGrupos(arrayPDF);
        } catch (error) {
            console.log("Error en servicio de horarioPDF por:", error);
            throw error;
        }
    }

    async AbrirCarpetaPDFs(directorio){
        try {
            return await window.electron.AbrirCarpetaContenedoraPDF(directorio);
        } catch (error) {
            console.log("Error en servicio de horarioPDF por:", error);
            throw error;
        }
    }

    async SetHorarioCambiadoFalse(){
        try {
            return await window.electron.TriggerHorarioFalse();
        } catch (error) {
            console.log("Error en servicio de horarioPDF por:", error);
            throw error;
        }
    }

    async DescargarPDFGrupos(){
        try {
            return await window.electron.DescargarPDFGrupos();
        } catch (error) {
            console.log("Error en servicio de horarioPDF por:", error);
            throw error;
        }
    }

    async DescargarPDFInstructores(){
        try {
            return await window.electron.DescargarPDFInstructores();
        } catch (error) {
            console.log("Error en servicio de horarioPDF por:", error);
            throw error;
        }
    }
}
export default HorarioPDFServicio;