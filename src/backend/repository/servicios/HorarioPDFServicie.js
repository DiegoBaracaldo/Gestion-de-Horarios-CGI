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
}
export default HorarioPDFServicio;