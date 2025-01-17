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

}
export default FranjaServicio;