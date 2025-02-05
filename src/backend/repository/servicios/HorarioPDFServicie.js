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

    async AbrirCarpetaPDFs(){
        try {
            return await window.electron.AbrirCarpetaContenedoraPDF();
        } catch (error) {
            console.log("Error en servicio de horarioPDF por:", error);
            throw error;
        }
    }
}
export default HorarioPDFServicio;