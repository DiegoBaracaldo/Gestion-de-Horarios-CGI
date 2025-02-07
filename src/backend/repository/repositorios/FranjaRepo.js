class FranjaRepo {
    constructor(bd) {
        this.bd = bd;
    }

    async ActivarLlavesForaneas() {
        return new Promise((resolve, reject) => {
            this.db.run("PRAGMA foreign_keys = ON;", function (error) {
                if (error) reject(error);
                else resolve();
            });
        });
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
                        if (!encontrado) {
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
                            listaBloques.push(encontrado);
                        }
                        //Añadimos la franja una vez creado o encontrado el objeto y agregado a la lista
                        encontrado.franjas.add(fila.franja);
                    });
                    resolve(listaBloques);
                }
            });
        });
    }

    DeleteAndSaveFranjas(agregaciones, modificaciones, eliminaciones) {
        return new Promise((resolve, reject) => {
            const queryDelete = `DELETE FROM franjas WHERE franja = ? AND idGrupo = ?;`;
            const querySave = `
                INSERT INTO franjas (franja, idGrupo, idInstructor, idAmbiente, idCompetencia, numBloque)
                VALUES (?, ?, ?, ? ,?, ?);
            `;
            const queryUpdate = `
                UPDATE franjas SET idInstructor = ?, idAmbiente = ?, idCompetencia = ?, numBloque = ?
                WHERE franja = ? AND idGrupo = ?;
            `;
            this.bd.serialize(async () => {
                try {
                    await new Promise((resolve, reject) => {
                        this.db.run("BEGIN TRANSACTION", [], function (error) {
                            if (error) reject(error);
                            else resolve(this);
                        });
                    });

                    const runQuery = (query, params) => {
                        return new Promise((resolve, reject) => {
                            this.bd.run(query, params, function (error) {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    }

                    //Se espera que se haga la eliminación
                    const DeletePromesas = eliminaciones.map(tupla => {
                        const { franja, idGrupo } = tupla;
                        return runQuery(queryDelete, [franja, idGrupo]);
                    });
                    await Promise.all(DeletePromesas);

                    //Se espera que se haga el guardado
                    const savePromesas = agregaciones.map(franjaCompleta => {
                        const { franja, idGrupo, idInstructor, idAmbiente, idCompetencia, numBloque } = franjaCompleta;
                        return runQuery(querySave, [franja, idGrupo, idInstructor, idAmbiente, idCompetencia, numBloque]);
                    });
                    await Promise.all(savePromesas);

                    //Se espera que se hagan las modificaciones
                    const updatePromesas = modificaciones.map(tupla => {
                        const { idInstructor, idAmbiente, idCompetencia, numBloque, franja, idGrupo } = tupla;
                        return runQuery(queryUpdate, [idInstructor, idAmbiente, idCompetencia, numBloque, franja, idGrupo]);
                    });
                    await Promise.all(updatePromesas);

                    await runQuery("COMMIT;", []);

                    resolve(200);
                } catch (errorCatch) {
                    //Error en cualquier parte de las transacciones
                    const respuestaRollback =
                        await new Promise((resolve, reject) => {
                            this.bd.run("ROLLBACK", function (error) {
                                if (error) reject(902);
                                else resolve(errorCatch.errno)
                            });
                        });
                    reject(respuestaRollback);
                }
            });
        });
    }

    GetOcupanciaFranjasGrupo(idGrupo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT franja, idCompetencia FROM franjas 
                WHERE idGrupo = ?;
            `;

            this.bd.all(query, [idGrupo], function (error, filas) {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    GetFranjasByCompetenciaAndGrupo(idGrupo, idCompetencia) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM franjas
                WHERE idGrupo = ? AND idCompetencia = ?;
            `;
            this.bd.all(query, [idGrupo, idCompetencia], function (error, filas) {
                if (error) reject(error.errno);
                else resolve(filas);
            });
        });
    }

    ConfirmarHorarioCompleto() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    CASE 
                        WHEN COUNT(P.idGrupo) = 0 THEN 0
                        ELSE MIN(CASE 
                                    WHEN F.franja_count / 2 = C.horasRequeridas THEN 1 
                                    ELSE 0 
                                 END)
                    END AS todos_cumplen
                FROM 
                    piscinaCompetencias P
                JOIN 
                    competencias C ON P.idCompetencia = C.id
                LEFT JOIN 
                    (SELECT 
                         idGrupo, 
                         idCompetencia, 
                         COUNT(*) AS franja_count
                     FROM 
                         franjas
                     WHERE
                          idAmbiente IS NOT NULL AND idAmbiente <> ''
                          AND idInstructor IS NOT NULL AND idInstructor <> ''
                     GROUP BY 
                         idGrupo, idCompetencia) F 
                    ON P.idGrupo = F.idGrupo AND P.idCompetencia = F.idCompetencia;
            `;

            // Usar get porque esperamos un solo valor
            this.bd.get(query, (err, row) => {
                if (err) {
                    reject(err.errno);
                } else {
                    resolve(row.todos_cumplen);
                }
            });
        });
    }
}

module.exports = FranjaRepo;