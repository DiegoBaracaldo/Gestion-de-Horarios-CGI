
class InstructorRepo {

    constructor(db) {
        this.db = db;
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM instructores";
            this.db.all(query, [], (error, filas) => {
                if(error) reject(error);
                else resolve(filas);
            });
        });
    }

    // GetById(id) {
    //     let InstructorAux = null;
    //     instructores.forEach((Instructor) => {
    //         if (Instructor.id === id) InstructorAux = Instructor;
    //     });
    //     return InstructorAux;
    // }

    // SaveNew(Instructor) {
    //     instructores.push(Instructor);
    // }

    // Save(idViejo, Instructor) {
    //     //actualizar
    //     let InstructorIndex = instructores.findIndex(e => e.id === idViejo);
    //     instructores[InstructorIndex] = Instructor;
    // }

    // //Se trabaja con array de ids a eliminar.
    // Remove(idArray) {
    //     //Se recogen los index para hacer splice a la lista
    //     const arrayIndex = [];
    //     instructores.forEach((inst, index) => {
    //         if (idArray.includes(inst.id)) arrayIndex.push(index);
    //     });
    //     console.log(arrayIndex);
    //     arrayIndex.forEach((indexInstructor, index) => {
    //         //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
    //         indexInstructor = indexInstructor - index;
    //         instructores.splice(indexInstructor, 1);
    //     });
    // }
}
module.exports = InstructorRepo;