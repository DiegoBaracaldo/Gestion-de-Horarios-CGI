
class TorreServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllTorres();
        } catch (error) {
          console.log("error en crud torres por: ", error);
          return [];
        }
    }

    // GuardarTorre(torre){
    //     const repo = new TorreRepo();
    //     repo.SaveNew(torre);
    // }

    // CargarTorre(idTorre){
    //     const repo = new TorreRepo();
    //     return repo.GetById(idTorre);
    // }

    // ActualizarTorre (idViejo, torre){
    //     const repo = new TorreRepo();
    //     repo.Save(idViejo, torre);
    // }
    
    // EliminarTorre(listaIDs){
    //     const repo = new TorreRepo();
    //     repo.Remove(listaIDs);
    // }
}


export default TorreServicio;