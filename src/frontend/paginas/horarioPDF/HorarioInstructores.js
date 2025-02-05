import Swal from "sweetalert2";
import AmbienteServicio from "../../../backend/repository/servicios/AmbienteService";
import CompetenciaServicio from "../../../backend/repository/servicios/CompetenciaService";
import FranjaServicio from "../../../backend/repository/servicios/FranjaService";
import GrupoServicio from "../../../backend/repository/servicios/GrupoService";
import InstructorServicio from "../../../backend/repository/servicios/InstructorService";
import './EstiloTablaInstructor.css';
import { FranjasContiguasVerticales, GetDiaCorrespondiente, GetHoraInicioHoraFin } from "./UtilidadesHorarioPDF";

class CrearHorarioInstructores {
    constructor() {
        this.instructores = new Map();
    }

    ObtenerHorarioInstructores() {
        return this.GetMaps();
    }

    async GetMaps() {
        try {
            const respuesta = await new FranjaServicio().CargarFranjas();
            // console.log(respuesta);
            //Auxiliares pare ir recogiendo información
            const auxIdsInstructores = new Set();
            const franjasInstructores = new Map();
            const bloquesCrudosInstructores = new Map();
            //Recojo las franjas y ids de cada instructor
            respuesta.forEach(franja => {
                if (franja) {
                    const arrayFranjasInstructor = franjasInstructores.get(franja.idInstructor);
                    if (!arrayFranjasInstructor) {
                        franjasInstructores.set(franja.idInstructor, []);
                    }
                    arrayFranjasInstructor?.push(franja);

                    //Se van llenando los id de los instructores y grupos sin repetir
                    auxIdsInstructores.add(franja.idInstructor);
                }
            });

            //Ahora crear Map de instructores y grupos con su respectivo objeto usando de clave su id
            const promesaInstructores = await new InstructorServicio().CargarInstructores([...auxIdsInstructores]);

            promesaInstructores.forEach(instructor => {
                this.instructores.set(instructor.id, instructor);
            });

            //Ahora se Crean los bloques crudos que serán usados para pedir info a BD y armar bloques reales

            ////Instructores
            for (let [clave, valor] of franjasInstructores) {
                const auxMap = new Map();
                valor.forEach(franja => {
                    const key = `${franja.idCompetencia}-${franja.idGrupo}-${franja.idAmbiente}`;
                    if (!auxMap.has(key)) {
                        auxMap.set(key, {
                            idCompetencia: franja.idCompetencia,
                            idGrupo: franja.idGrupo,
                            idAmbiente: franja.idAmbiente,
                            franjas: new Set()
                        });
                    }
                    auxMap.get(key).franjas.add(franja.franja);
                });
                bloquesCrudosInstructores.set(clave, [...auxMap.values()]);
            }
            //Ahora se obtienen los bloques reales que serán convertidos a Horarios
            return this.GetBloquesRealesInstructores(bloquesCrudosInstructores);
        } catch (error) {
            console.log(error);
            Swal.fire(error)
        }
    }

    //Función para la consulta masiva 
    async GetBloquesRealesInstructores(mapaCrudos) {
        try {
            const mapBloques = new Map();

            const { competenciasId, gruposId, ambientesId } = this.GetUniqueIdsInstructores(mapaCrudos);
            const arrayCompetencias = await new CompetenciaServicio().CargarCompetencias(competenciasId);
            const arrayAmbientes = await new AmbienteServicio().CargarAmbientes(ambientesId);
            const arrayGrupos = await new GrupoServicio().CargarGrupos(gruposId);

            const competenciasMap = new Map();
            arrayCompetencias.forEach(competencia => {
                competenciasMap.set(competencia.id, competencia)
            });

            const gruposMap = new Map();
            arrayGrupos.forEach(grupo => {
                gruposMap.set(grupo.id, grupo);
            });

            const ambientesMap = new Map();
            arrayAmbientes.forEach(ambiente => {
                ambientesMap.set(ambiente.id, ambiente);
            });

            for (const [clave, listaBloquesCrudos] of mapaCrudos) {
                const listaBloquesReales = listaBloquesCrudos.map(bloqueCrudo => {
                    const objGrupoAux = gruposMap.get(bloqueCrudo.idGrupo);
                    return {
                        franjas: new Set(bloqueCrudo.franjas),
                        descripcionCompetencia: competenciasMap.get(bloqueCrudo.idCompetencia).descripcion,
                        nombreAmbiente: ambientesMap.get(bloqueCrudo?.idAmbiente).nombre,
                        fichaGrupo: objGrupoAux.id,
                        codigoGrupo: objGrupoAux.codigoGrupo,
                        trimestreLectivo: objGrupoAux.trimestreLectivo
                    }
                });

                mapBloques.set(clave, listaBloquesReales);
            }
            return this.GetHorarios(mapBloques);
        } catch (error) {
            console.log(error);
            Swal.fire(error);
        }
    }

    //Para obtener la información solo una vez y así optimizar la consulta
    GetUniqueIdsInstructores(map) {
        const competenciasUnicas = new Set();
        const gruposUnicos = new Set();
        const ambientesUnicos = new Set();

        for (const lista of map.values()) {
            for (const bloqueCrudo of lista) {
                competenciasUnicas.add(bloqueCrudo.idCompetencia);
                gruposUnicos.add(bloqueCrudo.idGrupo);
                ambientesUnicos.add(bloqueCrudo.idAmbiente);
            }
        }
        return {
            competenciasId: [...competenciasUnicas],
            gruposId: [...gruposUnicos],
            ambientesId: [...ambientesUnicos]
        }
    }

    GetHorarios(mapBloquesReales) {
        const mapHorarios = new Map();
        for (const [idInstructor, listaBloques] of mapBloquesReales) {
            const objHorario = {
                nombre: this.instructores.get(idInstructor).nombre,
                totalHorasSemanales: listaBloques.reduce((acc, bloque) => {
                    return bloque.franjas.size + acc;
                }, 0) / 2,
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
            };
            for (const bloque of listaBloques) {
                //Subcategorizar bloques por contiguidad vertical
                const objetosSubBloque = FranjasContiguasVerticales([...bloque.franjas]);
                objetosSubBloque.forEach(paqueteFranjas => {
                    //Enviar objeto completo con las horas militares correspondientes al día que 
                    const [horaInicio, horaFin] = GetHoraInicioHoraFin(paqueteFranjas);
                    const diaCorrespondiente = GetDiaCorrespondiente(paqueteFranjas[0]);
                    const objSubHorario = {
                        descripcionCompetencia: bloque.descripcionCompetencia,
                        nombreAmbiente: bloque.nombreAmbiente,
                        fichaGrupo: bloque.fichaGrupo,
                        codigoGrupo: bloque.codigoGrupo,
                        trimestreLectivo: bloque.trimestreLectivo,
                        horaInicial: horaInicio,
                        horaFin: horaFin
                    };
                    objHorario[diaCorrespondiente].push(objSubHorario);
                });
            }
            //Ordeno los bloques de cada día del más temprano al más tarde
            Object.keys(objHorario).map(key => {
                //Se detectan los días y que no estén vacíos
                if (Array.isArray(objHorario[key]) && objHorario[key].length > 0) {
                    objHorario[key].sort((a, b) => a.horaInicial - b.horaInicial);
                }
            });
            //transformo la hora a texto normal

            //Se agrega el horario completo al mapa de horarios de los instructores
            mapHorarios.set(idInstructor, { ...objHorario });
        }
        return mapHorarios;
    }

    //Función para convertir la información cruda del objeto horario de cada instructor  a uno 
    //// apto para el pdf
    GetTablaHorarioInstructor(horarioInstructor) {
        return (
            <table id="tablaHorarioPDFInstructor">
                <thead>
                    <tr className="titulo">
                        <th>horario semanal instructor</th>
                    </tr>
                    <tr className="subtitulo">
                        <th>{horarioInstructor.nombre}</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(horarioInstructor).map(key => {
                        let arrayDia = horarioInstructor[key];
                        //Se detectan los días y que no estén vacíos
                        if (Array.isArray(arrayDia) && arrayDia.length > 0) {
                            return (
                                <tr>
                                    <td>
                                        <div className="filaDia">
                                            {key}
                                        </div>
                                        {
                                            arrayDia.map(subBloque => 
                                                <div className="filaSubBloque">
                                                    <label className="hora">
                                                        {`${subBloque.horaInicial.substring(0,2)}:${subBloque.horaInicial.substring(2,4)}
                                                         - 
                                                        ${subBloque.horaFin.substring(0,2)}:${subBloque.horaFin.substring(2,4)}`}
                                                        </label>
                                                    <label className="etDescriComp">{subBloque.descripcionCompetencia}</label>
                                                    <label>{subBloque.ambiente}</label>
                                                    <label>{subBloque.fichaGrupo}</label>
                                                    <label>{subBloque.codigoGrupo}</label>
                                                    <label>{subBloque.trimestreLectivo}</label>
                                                </div>
                                            )
                                        }
                                    </td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
        );
    }
}
export default CrearHorarioInstructores;