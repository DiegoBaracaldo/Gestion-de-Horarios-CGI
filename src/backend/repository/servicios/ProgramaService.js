import ProgramaRepo from "../repositorios/ProgramaRepo"

class ProgramaServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllProgramas();
        } catch (error) {
          console.log("error en crud progrmas por: ", error);
          return [];
        }
    }

    // GuardarPrograma(programa){
    //     const repo = new ProgramaRepo();
    //     repo.SaveNew(programa);
    // }

    // CargarPrograma(id){
    //     const repo = new ProgramaRepo();
    //     return repo.GetById(id);
    // }

    // ActualizarPrograma(idViejo, programa){
    //     const repo = new ProgramaRepo();
    //     repo.Save(idViejo, programa);
    // }
    
    // EliminarPrograma(listaIDs){
    //     const repo = new ProgramaRepo();
    //     repo.Remove(listaIDs);
    // }
}


export default ProgramaServicio;