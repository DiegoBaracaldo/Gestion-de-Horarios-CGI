import Swal from "sweetalert2";
import AmbienteServicio from "../../../backend/repository/servicios/AmbienteService";
import InstructorServicio from "../../../backend/repository/servicios/InstructorService";

// // // export function BloquesToFranjas(listaBloques, idGrupo, idCompetencia) {
// // //     //Ahora con la lista de bloques actualizada se hace la transformación de bloques a franjas
// // //     const franjasListaAux = [];
// // //     listaBloques.forEach(bloque => {
// // //         if (bloque.franjas.size > 0 && Object.values(bloque.instructor).length > 0
// // //             && Object.values(bloque.ambiente).length > 0) {
// // //             bloque.franjas.forEach(franja => {
// // //                 const objAuxFranja = {
// // //                     franja: franja,
// // //                     idGrupo: idGrupo,
// // //                     idInstructor: bloque.instructor.id,
// // //                     idAmbiente: bloque.ambiente.id,
// // //                     idCompetencia: idCompetencia
// // //                 };
// // //                 franjasListaAux.push(objAuxFranja);
// // //             });
// // //         }
// // //     });
// // //     return franjasListaAux;
// // // }

// // // export async function FranjasToBloques(listaFranjas) {
// // //     const auxBloquesLista = [];

// // //     for (const franja of listaFranjas) {
// // //         let encontrado =
// // //             auxBloquesLista.find(bloque => bloque.ambiente.id === franja.idAmbiente
// // //                 && bloque.instructor.id === franja.idInstructor);
// // //         if (!encontrado) {
// // //             let auxInstruc = {};
// // //             let auxAmbiente = {};
// // //             const busquedaInstrc = new InstructorServicio().CargarInstructor(franja.idInstructor);
// // //             const busquedaAmbiente = new AmbienteServicio().CargarAmbiente(franja.idAmbiente);
// // //             try {
// // //                 const respuestaPromesa = await Promise.all([busquedaInstrc, busquedaAmbiente]);
// // //                 auxInstruc = respuestaPromesa[0];
// // //                 auxAmbiente = respuestaPromesa[1];
// // //             } catch (error) {
// // //                 console.log("Error al obtener ambiente o instructor del bloque por: " + error);
// // //                 throw error;
// // //             }
// // //             encontrado = {
// // //                 numBloque: auxBloquesLista.length + 1,
// // //                 instructor: auxInstruc,
// // //                 ambiente: auxAmbiente,
// // //                 franjas: new Set()
// // //             };
// // //             auxBloquesLista.push(encontrado);
// // //         }
// // //         encontrado.franjas.add(franja.franja);
// // //     }
// // //     return auxBloquesLista;
// // // }

export function FranjasPersonalizadasToBloques(franjasGrupoCompletas, idCompetencia) {
    // console.log(franjasGrupoCompletas);
    //Se necesitan las franjas completas del grupo para no perder el índice
    const listaBloques = [];
    franjasGrupoCompletas.forEach((franja, index) => {
        //Para tomar solo las franjas de la competencia seleccionada
        if (franja?.idCompetencia === idCompetencia) {
            //Se condiciona para poder almacenar bloques incompletos
            if(index <= 336){
                let encontrado = listaBloques.find(bloque => bloque.numBloque === franja.numBloque);
                if (!encontrado) {
                    encontrado = {
                        numBloque: franja.numBloque,
                        instructor: franja.instructor,
                        ambiente: franja.ambiente,
                        franjas: new Set()
                    }
                    listaBloques.push(encontrado);
                }
                encontrado.franjas.add(index);
            }else{
                //Se espera que la franja tenga al menos idCompetencia y numBloque
                listaBloques.push({
                    numBloque: franja.numBloque,
                    instructor: {},
                    ambiente: {},
                    franjas: new Set()
                });
            }
        }

    });
    listaBloques.sort((a, b) => a.numBloque - b.numBloque);
    return [...listaBloques];
}

// export function FranjasPersonalizadasToBloques(franjasGrupoCompletas, idCompetencia) {
//     //Se necesitan las franjas completas del grupo para no perder el índice
//     const listaBloques = [];
//     franjasGrupoCompletas.forEach((franja, index) => {
//         //Para tomar solo las franjas de la competencia seleccionada
//         if (franja.idCompetencia === idCompetencia) {
//             //Se condiciona para poder almacenar bloques incompletos
//             if(index <= 336){
//                 let encontrado = listaBloques.find(bloque => bloque.instructor.id === franja.instructor.id
//                     && bloque.ambiente.id === franja.ambiente.id
//                 );
//                 if (!encontrado) {
//                     encontrado = {
//                         numBloque: listaBloques.length + 1,
//                         instructor: franja.instructor,
//                         ambiente: franja.ambiente,
//                         franjas: new Set()
//                     }
//                     listaBloques.push(encontrado);
//                 }
//                 encontrado.franjas.add(index);
//             }else{
//                 //Se espera que la franja tenga al menos idCompetencia y numBloque
//                 listaBloques.push({
//                     numBloque: listaBloques.length + 1,
//                     instructor: {},
//                     ambiente: {},
//                     franjas: new Set()
//                 });
//             }
//         }

//     });
//     return listaBloques;
// }