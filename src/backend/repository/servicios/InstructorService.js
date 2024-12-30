
class InstructorServicio {

    constructor() {

    }

    async CargarLista() {
        console.log("cargando lista...");
        try {
          return await window.electron.GetAllInstructores();
        } catch (error) {
          console.log("error en crud torres por: ", error);
          return [];
        }
    }

//     GuardarInstructor(instructor){
//         const repo = new InstructorRepo();
//         repo.SaveNew(instructor);
//     }

//     CargarInstructor(idIstructor){
//         const repo = new InstructorRepo();
//         return repo.GetById(idIstructor);
//     }

//     ActualizarInstructor(idViejo, instructor){
//         const repo = new InstructorRepo();
//         repo.Save(idViejo, instructor);
//     }

//     ElimarInstructores(listaIDs){
//         const repo = new InstructorRepo();
//         repo.Remove(listaIDs);
//     }
}


export default InstructorServicio;