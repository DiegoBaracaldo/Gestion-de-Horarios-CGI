import './EstilosTablaGrupo.css';
import Swal from "sweetalert2";
import AmbienteServicio from "../../../backend/repository/servicios/AmbienteService";
import CompetenciaServicio from "../../../backend/repository/servicios/CompetenciaService";
import FranjaServicio from "../../../backend/repository/servicios/FranjaService";
import GrupoServicio from "../../../backend/repository/servicios/GrupoService";
import InstructorServicio from "../../../backend/repository/servicios/InstructorService";
import ProgramaServicio from "../../../backend/repository/servicios/ProgramaService";
import { FranjasContiguasVerticales, GetBloquesPorDia, GetHoraInicioHoraFin } from "./UtilidadesHorarioPDF";
import FusionesServicio from '../../../backend/repository/servicios/FusionesService';

class CrearHorarioGrupos {
    constructor() {
        this.grupos = new Map();
        this.gruposHuespedes = new Map();
        this.fusiones = new Map();
    }

    ObtenerHorarioGrupos() {
        return this.GetMaps();
    }

    async GetMaps() {
        try {
            const respuesta = await new FranjaServicio().CargarFranjas();
            // console.log(respuesta);
            //Auxiliares pare ir recogiendo información
            const auxIdsGrupos = new Set();
            const franjasGrupos = new Map();
            const bloquesCrudosGrupos = new Map();
            //Recojo las franjas y ids de cada grupo de una vez
            respuesta.forEach(franja => {
                if (franja) {
                    const arrayFranjasGrupo = franjasGrupos.get(franja.idGrupo);
                    if (!arrayFranjasGrupo) {
                        franjasGrupos.set(franja.idGrupo, []);
                    }
                    franjasGrupos.get(franja.idGrupo).push(franja);

                    //Se van llenando los id de losgrupos sin repetir
                    auxIdsGrupos.add(franja.idGrupo);
                }
            });

            //Ahora crear Map de grupos con su respectivo objeto usando de clave su id
            const promesaGrupos = await new GrupoServicio().CargarLista();

            promesaGrupos.forEach(grupo => {
                if(auxIdsGrupos.has(grupo.id)) this.grupos.set(grupo.id, grupo);
                //Se supone que si no están ahí, entonces son huéspedes
                else this.gruposHuespedes.set(grupo.id, grupo);
            });

            //Ahora se Crean los bloques crudos que serán usados para pedir info a BD y armar bloques reales

            ////Grupos
            for (let [clave, valor] of franjasGrupos) {
                const auxMap = new Map();
                valor.forEach(franja => {
                    const key = `${franja.idCompetencia}-${franja.idInstructor}-${franja.idAmbiente}`;
                    if (!auxMap.has(key)) {
                        auxMap.set(key, {
                            idCompetencia: franja.idCompetencia,
                            idInstructor: franja.idInstructor,
                            idAmbiente: franja.idAmbiente,
                            franjas: new Set()
                        });
                    }
                    auxMap.get(key).franjas.add(franja.franja);
                });
                bloquesCrudosGrupos.set(clave, [...auxMap.values()]);
            }

            //Ahora se obtienen los bloques reales que serán convertidos a Horarios
            return this.GetBloquesRealesGrupos(bloquesCrudosGrupos);
        } catch (error) {
            console.log(error);
            Swal.fire(error)
        }
    }
    //Función para la consulta masiva 
    async GetBloquesRealesGrupos(mapaCrudos) {
        try {
            const mapBloques = new Map();

            const { competenciasId, instructoresId, ambientesId, programasId } = this.GetUniqueIdsGrupos(mapaCrudos);
            const promesaCompetencias = new CompetenciaServicio().CargarCompetencias(competenciasId);
            const promesaAmbientes = new AmbienteServicio().CargarAmbientes(ambientesId);
            const promesaInstructores = new InstructorServicio().CargarInstructores(instructoresId);
            const promesaProgramas = new ProgramaServicio().CargarLista();
            const promesaFusiones = new FusionesServicio().CargarLista();

            const [arrayCompetencias, arrayAmbientes, arrayInstructores, arrayProgramas, arrayFusiones] =
                await Promise.all([promesaCompetencias, promesaAmbientes, promesaInstructores, promesaProgramas, promesaFusiones]);

            const competenciasMap = new Map();
            arrayCompetencias.forEach(competencia => {
                competenciasMap.set(competencia.id, competencia)
            });

            const instructoresMap = new Map();
            arrayInstructores.forEach(instructor => {
                instructoresMap.set(instructor.id, instructor);
            });

            const ambientesMap = new Map();
            arrayAmbientes.forEach(ambiente => {
                ambientesMap.set(ambiente.id, ambiente);
            });

            const programasMap = new Map();
            arrayProgramas.forEach(programa => {
                programasMap.set(programa.id, programa);
            });

            //Se hace map de fusiones basados en el anfitrion
            arrayFusiones.forEach(fusion => {
                if(!this.fusiones.has(fusion.idAnfitrion)){
                    this.fusiones.set(fusion.idAnfitrion, []);
                }
                this.fusiones.get(fusion.idAnfitrion).push(fusion.idHuesped);
            });

            for (const [clave, listaBloquesCrudos] of mapaCrudos) {
                const listaBloquesReales = listaBloquesCrudos.map(bloqueCrudo => {
                    return {
                        franjas: [...bloqueCrudo.franjas].sort((a, b) => a - b),
                        descripcionCompetencia: competenciasMap.get(bloqueCrudo.idCompetencia).descripcion,
                        nombreAmbiente: ambientesMap.get(bloqueCrudo?.idAmbiente).nombre,
                        nombreInstructor: instructoresMap.get(bloqueCrudo.idInstructor).nombre,
                        nombrePrograma: programasMap.get(this.grupos.get(clave).idPrograma).nombre
                    }
                });

                mapBloques.set(clave, listaBloquesReales);
            }
            //console.log(mapBloques);
            return this.GetHorarios(mapBloques);
        } catch (error) {
            console.log(error);
            Swal.fire(error);
        }
    }

    //Para obtener la información solo una vez y así optimizar la consulta
    GetUniqueIdsGrupos(map) {
        const competenciasUnicas = new Set();
        const instructoresUnicos = new Set();
        const ambientesUnicos = new Set();

        for (const lista of map.values()) {
            for (const bloqueCrudo of lista) {
                competenciasUnicas.add(bloqueCrudo.idCompetencia);
                instructoresUnicos.add(bloqueCrudo.idInstructor);
                ambientesUnicos.add(bloqueCrudo.idAmbiente);
            }
        }
        return {
            competenciasId: [...competenciasUnicas],
            instructoresId: [...instructoresUnicos],
            ambientesId: [...ambientesUnicos]
        }
    }

    GetHorarios(mapBloquesReales) {
        const mapHorarios = new Map();

        for (const [idGrupo, listaBloques] of mapBloquesReales) {
            const objGrupo = this.grupos.get(idGrupo);
            const objHorario = {
                codigoGrupo: objGrupo.codigoGrupo,
                codigoFicha: objGrupo.id,
                nombrePrograma: listaBloques[0].nombrePrograma,
                trimestreLectivo: objGrupo.trimestreLectivo,
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
            };
            for (const bloque of listaBloques) {
                //Primero asigno subbloques reales por día
                const franjasPorDia = GetBloquesPorDia(bloque.franjas);
                // console.log(franjasPorDia);
                Object.keys(franjasPorDia).forEach(dia => {
                    const franjas = franjasPorDia[String(dia)];
                    if (franjas.length > 0) {
                        objHorario[String(dia)].push({
                            ...bloque,
                            franjas: [...franjas]
                        });
                    }
                });
            }
            // console.log(objHorario);
            //bloques al día por contiguidad vertical
            Object.keys(objHorario).forEach(clave => {
                let valor = objHorario[String(clave)];
                //Si es DÍA y tiene bloques adentro
                if (Array.isArray(valor) && valor.length > 0) {
                    const nuevoValor = [];
                    //Se determina la contiguidad vertical para dividir cada bloque en sub bloques por
                    ////falta de contiguidad vertical
                    valor.forEach(bloque => {
                        const objetosSubBloque = FranjasContiguasVerticales(bloque.franjas);
                        // console.log(objetosSubBloque);
                        objetosSubBloque.forEach(arrayFranjas => {
                            const [horaInicio, horaFin] = GetHoraInicioHoraFin(arrayFranjas);
                            // console.log(bloque);
                            nuevoValor.push({
                                ...bloque,
                                franjas: arrayFranjas,
                                horaInicial: horaInicio,
                                horaFin: horaFin
                            });
                        });
                    });
                    objHorario[clave] = [...nuevoValor];
                }
            });
            // console.log(objHorario);
            //--falta ordenar de temprano a tarde x hora incial

            //Ordeno los bloques de cada día del más temprano al más tarde
            Object.keys(objHorario).map(key => {
                //Se detectan los días y que no estén vacíos
                if (Array.isArray(objHorario[key]) && objHorario[key].length > 0) {
                    objHorario[key].sort((a, b) => a.horaInicial - b.horaInicial);
                }
            });

            //Se agrega el horario completo al mapa de horarios de los instructores
            mapHorarios.set(idGrupo, { ...objHorario });
            
            //Para los grupos fusionados
            if(this.fusiones.has(idGrupo)){
                this.fusiones.get(idGrupo).forEach(idHuesped => {
                    const objGrupoHuesped = this.gruposHuespedes.get(idHuesped);
                    mapHorarios.set(idHuesped, {
                        ...objHorario,
                        codigoGrupo: objGrupoHuesped.codigoGrupo,
                        codigoFicha: objGrupoHuesped.id,
                        trimestreLectivo: objGrupoHuesped.trimestreLectivo
                    });
                });
            }
        }
        return mapHorarios;
    }

    //Función para convertir la información cruda del objeto horario de cada instructor  a uno 
    //// apto para el pdf
    GetTablaHorarioGrupo(horarioGrupo) {

        return (
            <table id="tablaHorarioPDFGrupo">
                <thead>
                    <tr className="titulo">
                        <th>horario semanal grupo</th>
                    </tr>
                    <tr className="subtitulo">
                        <th className='thInfoGrupo'>
                            <span>{`${horarioGrupo.codigoGrupo}  - ${horarioGrupo.trimestreLectivo}`}</span>
                            <span>{horarioGrupo.nombrePrograma}</span>
                        </th>
                    </tr>
                    <tr className="subtitulo">
                        <th><span className='tituloFicha'>código ficha sofia : </span>{horarioGrupo.codigoFicha}</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(horarioGrupo).map(key => {
                        let arrayDia = horarioGrupo[key];
                        //Se detectan los días y que no estén vacíos
                        if (Array.isArray(arrayDia) && arrayDia.length > 0) {
                            return (
                                <tr key={`filasHorarioGrupoPDF${key}`}>
                                    <td>
                                        <div className="filaDia">
                                            {key}
                                        </div>
                                        {
                                            arrayDia.map((subBloque, index) =>
                                                <div className="filaSubBloque" key={`subBloqueFilasHorarioGrupoPDF${index}`}>
                                                    <label className="hora">
                                                        {`${subBloque.horaInicial.substring(0, 2)}:${subBloque.horaInicial.substring(2, 4)}
                                                         - 
                                                        ${subBloque.horaFin.substring(0, 2)}:${subBloque.horaFin.substring(2, 4)}`}
                                                    </label>
                                                    <label className="etDescriComp">{subBloque.descripcionCompetencia}</label>
                                                    <label className='nombreAmbiente'>{subBloque.nombreAmbiente}</label>
                                                    <label className='nombreInstructor'>{subBloque.nombreInstructor}</label>
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
export default CrearHorarioGrupos;