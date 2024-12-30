
class GrupoServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("Cargando lista...");
        try {
            return await window.electron.GetAllGrupos();
        } catch (error) {
            console.log("Error en grupoService por: ", error);
            return [];
        }
    }

    // GuardarGrupo(grupo){
    //     const repo = new GrupoRepo();
    //     repo.SaveNew(grupo);
    // }

    // ActualizarGrupo(idViejo, grupo){
    //     const repo = new GrupoRepo();
    //     repo.Save(idViejo, grupo);
    // }

    // EliminarGrupo(listaIDs){
    //     const repo = new GrupoRepo();
    //     repo.Remove(listaIDs);
    // }
}


export default GrupoServicio;