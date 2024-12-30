class AmbienteServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllAmbientes();
        } catch (error) {
          console.log("error en ambiente service por: ", error);
          return [];
        }
    }

    // GuardarAmbiente(ambiente){
    //     const repo = new AmbienteRepo();
    //     repo.SaveNew(ambiente);
    // }

    // ActualizarAmbiente(idViejo, ambiente){
    //     const repo = new AmbienteRepo();
    //     repo.Save(idViejo, ambiente);
    // }

    // EliminarAmbiente(listaIDs){
    //     const repo = new AmbienteRepo();
    //     repo.Remove(listaIDs);
    // }
}


export default AmbienteServicio;