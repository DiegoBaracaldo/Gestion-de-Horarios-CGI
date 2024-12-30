
class ProgramaRepo {

    constructor(db) {
        this.db = db;
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM programas";
            this.db.all(query, [], (error, filas) => {
                if(error) reject(error);
                else resolve(filas);
            });
        });
    }

    // GetById(id) {
    //     let programaAux = null;
    //     programasAcademicos.forEach((programa) => {
    //         if (programa.id === id) programaAux = programa;
    //     });
    //     return programaAux;
    // }

    // SaveNew(programa) {
    //     programasAcademicos.push(programa);
    // }

    // Save(idViejo, programa) {
    //     //actualizar
    //     let programaIndex = programasAcademicos.findIndex(e => e.id === idViejo);
    //     programasAcademicos[programaIndex] = programa;
    // }

    // //Se trabaja con array de ids a eliminar.
    // Remove(idArray) {
    //      //Se recogen los index para hacer splice a la lista
    //      const arrayIndex = [];
    //      programasAcademicos.forEach((programa, index) => {
    //          if (idArray.includes(programa.id)) arrayIndex.push(index);
    //      });
    //      console.log(arrayIndex);
    //      arrayIndex.forEach((indexPrograma, index) => {
    //          //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
    //          indexPrograma = indexPrograma - index;
    //          programasAcademicos.splice(indexPrograma, 1);
    //      });
    // }
}
module.exports = ProgramaRepo;