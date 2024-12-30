
class JornadaServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllJornadas();
        } catch (error) {
          console.log("error en crud jornadas por: ", error);
          return [];
        }
    }

    // GuardarJornada(jornada){
    //     const repo = new JornadaRepo();
    //     repo.SaveNew(jornada);
    // }

    // CargarJornada(id){
    //     const repo = new JornadaRepo();
    //     return repo.GetById(id);
    // }

    // ActualizarJornada(idViejo, jornada){
    //     const repo = new JornadaRepo();
    //     repo.Save(idViejo, jornada);
    // }

    // EliminarJornada(listaIDs){
    //     const repo = new JornadaRepo();
    //     repo.Remove(listaIDs);
    // }
}


export default JornadaServicio;