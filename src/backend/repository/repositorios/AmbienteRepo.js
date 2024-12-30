
class AmbienteRepo{

    constructor(db){
        this.db = db;
    }

    async GetAll() {
        return new Promise((resolve, reject) => {
            const query =
             "SELECT " + 
                "ambientes.*, " + 
                "torres.nombre AS nombreTorre " + 
                "FROM " +
                "ambientes " +
                "JOIN " +
                "torres ON ambientes.idTorre = torres.id ";

            this.db.all(query, [], (err, filas) => {
                if(err) reject(err);
                else resolve(filas);
            });
        });
    }

    // GetById(id){
    //     let ambienteAux = null;
    //     ambientes.forEach((ambiente) => {
    //         if(ambiente.id === id) ambienteAux = ambiente;
    //     });
    //     return ambienteAux;
    // }

    // SaveNew(ambiente){
    //     ambientes.push(ambiente);
    // }

    // Save(idViejo, ambiente){
    //         //actualizar
    //         let ambienteIndex = ambientes.findIndex(e => e.id === idViejo);
    //         ambientes[ambienteIndex] = ambiente;
    // }

    // //Se trabaja con array de ids a eliminar.
    // Remove(idArray){
    //     //Se recogen los index para hacer splice a la lista
    //     const arrayIndex = [];
    //     ambientes.forEach((ambiente, index) => {
    //         if (idArray.includes(ambiente.id)) arrayIndex.push(index);
    //     });
    //     console.log(arrayIndex);
    //     arrayIndex.forEach((indexAmbiente, index) => {
    //         //Variable necesaria ya que en cada splice la lista se actualiza y el index ya no coincide
    //         indexAmbiente = indexAmbiente - index;
    //         ambientes.splice(indexAmbiente, 1);
    //     });
    // }
}
module.exports = AmbienteRepo;