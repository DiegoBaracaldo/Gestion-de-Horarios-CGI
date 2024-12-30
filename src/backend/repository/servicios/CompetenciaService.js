class CompetenciaServicio {

    constructor() {

    }

    async CargarLista(idPrograma) {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllCompetencias(idPrograma);
        } catch (error) {
          console.log("error en servicio competencias por: ", error);
          return [];
        }
    }

    // GuardarCompetencia(competencia) {
    //     const repo = new CompetenciaRepo();
    //     repo.SaveNew(competencia);
    // }

    // CargarCompetencia(id) {
    //     const repo = new CompetenciaRepo();
    //     return repo.GetById(id);
    // }

    // ActualizarCompetencia(idViejo, competencia){
    //     const repo = new CompetenciaRepo();
    //     return repo.Save(idViejo, competencia);
    // }

    // EliminarCompetencia(listaIDs){
    //     const repo = new CompetenciaRepo();
    //     repo.Remove(listaIDs);
    // }
}


export default CompetenciaServicio;