import Swal from "sweetalert2";
import AmbienteServicio from "../../../backend/repository/servicios/AmbienteService";
import InstructorServicio from "../../../backend/repository/servicios/InstructorService";

export function BloquesToFranjas(listaBloques, idGrupo, idCompetencia) {
    //Ahora con la lista de bloques actualizada se hace la transformación de bloques a franjas
    const franjasListaAux = [];
    listaBloques.forEach(bloque => {
        if (bloque.franjas.size > 0 && Object.values(bloque.instructor).length > 0
            && Object.values(bloque.ambiente).length > 0) {
            bloque.franjas.forEach(franja => {
                const objAuxFranja = {
                    franja: franja,
                    idGrupo: idGrupo,
                    idInstructor: bloque.instructor.id,
                    idAmbiente: bloque.ambiente.id,
                    idCompetencia: idCompetencia
                };
                franjasListaAux.push(objAuxFranja);
            });
        }
    });
    return franjasListaAux;
}

export async function FranjasToBloques(listaFranjas) {
    const auxBloquesLista = [];

    for (const franja of listaFranjas) {
        let encontrado =
            auxBloquesLista.find(bloque => bloque.ambiente.id === franja.idAmbiente
                && bloque.instructor.id === franja.idInstructor);
        if (!encontrado) {
            let auxInstruc = {};
            let auxAmbiente = {};
            const busquedaInstrc = new InstructorServicio().CargarInstructor(franja.idInstructor);
            const busquedaAmbiente = new AmbienteServicio().CargarAmbiente(franja.idAmbiente);
            try {
                const respuestaPromesa = await Promise.all([busquedaInstrc, busquedaAmbiente]);
                auxInstruc = respuestaPromesa[0];
                auxAmbiente = respuestaPromesa[1];
            } catch (error) {
                console.log("Error al obtener ambiente o instructor del bloque por: " +  error);
                throw error;
            }
            encontrado = {
                numBloque: auxBloquesLista.length + 1,
                instructor: auxInstruc,
                ambiente: auxAmbiente,
                franjas: new Set()
            };
            auxBloquesLista.push(encontrado);
        }
        encontrado.franjas.add(franja.franja);
    }
    return auxBloquesLista;
}