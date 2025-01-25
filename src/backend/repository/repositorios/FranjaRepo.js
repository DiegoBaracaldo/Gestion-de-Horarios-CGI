class FranjaRepo {
    constructor(bd) {
        this.bd = bd;
    }

    GetAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM franjas";
            this.bd.all(query, [], (error, filas) => {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    GetBloquesByCompetencia(idGrupo, idCompetencia) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT f.franja, i.*, a.*,
                i.id AS idInstructor,
                i.nombre AS nombreInstructor,
                i.franjaDisponibilidad AS franjasInstructor,
                i.fechaRegistro AS fechaRegInstructor,
                a.id AS idAmbiente,
                a.nombre AS nombreAmbiente,
                a.franjaDisponibilidad AS franjasAmbiente,
                a.fechaRegistro AS fechaRegAmbiente
                FROM franjas f
                JOIN instructores i ON f.idInstructor = i.id
                JOIN ambientes a ON f.idAmbiente = a.id
                WHERE f.idGrupo = ? AND f.idCompetencia = ?;
            `;
            this.bd.all(query, [idGrupo, idCompetencia], (error, filas) => {
                if (error) reject(error.errno)
                else {
                    const listaBloques = [];
                    filas.forEach(fila => {
                        //Iteramos sobre la lista de filas de la BD para ir agrupando los objetos
                        //// y agregándolos a la listaBloques
                        let encontrado =
                            listaBloques.find(bloque => bloque.instructor.id === fila.idInstructor
                                && bloque.ambiente.id === fila.idAmbiente);
                        if(!encontrado){
                            encontrado = {
                                numBloque: listaBloques.length + 1,
                                instructor: {
                                    id: fila.idInstructor,
                                    nombre: fila.nombreInstructor,
                                    topeHoras: fila.topeHoras,
                                    correo: fila.correo,
                                    telefono: fila.telefono,
                                    especialidad: fila.especialidad,
                                    disponible: fila.disponible,
                                    franjaDisponibilidad: fila.franjasInstructor,
                                    fechaRegistro: fila.fechaRegInstructor
                                },
                                ambiente: {
                                    id: fila.idAmbiente,
                                    nombre: fila.nombreAmbiente,
                                    idTorre: fila.idTorre,
                                    capacidad: fila.capacidad,
                                    franjaDisponibilidad: fila.franjasAmbiente,
                                    fechaRegistro: fila.fechaRegAmbiente
                                },
                                franjas: new Set()
                            };
                            //Se agrega al array de bloques
                            listaBloques.add(fila.encontrado);
                        }
                        //Añadimos la franja una vez creado o encontrado el objeto y agregado a la lista
                        encontrado.franjas.add(fila.franja);
                    });
                    resolve(listaBloques);
                }
            });
        });
    }
}

module.exports = FranjaRepo;