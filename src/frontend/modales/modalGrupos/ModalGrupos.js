import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import CrudInstructores from '../../paginas/crudInstructores/CrudInstructores';
import CrudPrograma from '../../paginas/crudProgramas/CrudPrograma';
import CrudJornadas from '../../paginas/crudJornadas/CrudJornadas';
import { AlfaNumericaSinEspacio, CamposVacios, EsFecha, SoloNumeros } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien, HastaCincuenta, HastaDos } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import Grupo from '../../../backend/repository/entidades/Grupo';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import Swal from 'sweetalert2';
import { FormatearCodigoGrupo } from '../../../backend/formato/FormatoDatos';

const ModalGrupos = ({ abrirConsulta, abrirRegistro, onCloseProp, objConsulta }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    const [seleccResponsable, setSeleccResponsable] = useState(false);
    let responsableInicial = {};
    const [responsable, setResponsable] = useState(responsableInicial);
    const [seleccPrograma, setSeleccPrograma] = useState(false);
    let programaInicial = {};
    const [programa, setPrograma] = useState(programaInicial);
    const [seleccJornada, setSeleccJornada] = useState(false);
    let jornadaInicial = {};
    const [jornada, setJornada] = useState(jornadaInicial);

    const ObtenerObjetosRelacionados = async () => {
        try {
            const getPrograma = new ProgramaServicio().CargarPrograma(objConsulta.idPrograma);
            const getResponsable = new InstructorServicio().CargarInstructor(objConsulta.idResponsable);
            const getJornada = new JornadaServicio().CargarJornada(objConsulta.idJornada);
            const listaPromesas = [getPrograma, getResponsable, getJornada]

            const resultado = await Promise.all(listaPromesas);
            if (VerificarRespuesta(resultado)) {
                setPrograma(resultado[0]);
                setResponsable(resultado[1]);
                setJornada(resultado[2]);
                return true;
            } else {
                console.log("Algún objeto está vacío");
                return false;
            }

        } catch (error) {
            console.log("Error al obtener información relacionada del grupo por : " + error);
            return false;
        }
    }

    //Verifica que ninguno de los objetos recibidos esté vacío
    function VerificarRespuesta(array) {
        return array.every(objeto => Object.keys(objeto).length > 0);
    }

    useEffect(() => {
        if (objConsulta && Object.keys(objConsulta).length > 0) {
            //Si es consulta al inicio y el objeto está lleno
            const ObtenerRespuesta = async () => {
                const respuesta = await ObtenerObjetosRelacionados();
                if (!respuesta) {
                    Swal.fire("Error al obtener información del grupo");
                    onCloseProp && onCloseProp();
                }
            }
            ObtenerRespuesta();
        }
    }, []);

    const fichaInicial = objConsulta.id || '';
    const [ficha, setFicha] = useState(fichaInicial);
    const codigoInicial = objConsulta.codigoGrupo || '';
    const [codigoGrupo, setCodigoGrupo] = useState(codigoInicial);
    const aprendicesInicial = objConsulta.cantidadAprendices || '';
    const [cantidadAprendices, setCantidadAprendices] = useState(aprendicesInicial);
    const trimestreLectivoInicial = objConsulta.trimestreLectivo || '';
    const [trimestreLectivo, setTrimestreLectivo] = useState(trimestreLectivoInicial);
    const fechaInicioInicial = objConsulta.fechaInicioTrimestre || '';
    const [fechaInicio, setFechaInicio] = useState(fechaInicioInicial);
    const fechaFinInicial = objConsulta.fechaFinTrimestre || '';
    const [fechaFin, setFechaFin] = useState(fechaFinInicial);
    const esCadenaInicial = (objConsulta.esCadenaFormacion === 1 ? true : false) || '';
    const [esCadena, setEsCadena] = useState(esCadenaInicial);
    const [grupo, setGrupo] = useState({});

    const [programaNombre, setProgramaNombre] = useState("Seleccionar Programa...");
    const [jornadaNombre, setJornadaNombre] = useState("Seleccionar Jornada...");
    const [responsableNombre, setResponsableNombre] = useState("Seleccionar Responsable...");

    useEffect(() => {
        if (Object.keys(grupo).length > 0) {
            Registrar();
        }
    }, [grupo]);

    async function Registrar() {
        try {
            const servicioGrupo = new GrupoServicio();
            const respuesta = abrirConsulta ?
                await servicioGrupo.ActualizarGrupo(fichaInicial, grupo)
                : await servicioGrupo.GuardarGrupo(grupo);
            Swal.fire(respuesta !== 0 ? ("Grupo guardado correctamente!") : ("NO se guardó el grupo!"));
        } catch (error) {
            Swal.fire(error);
        }
        onCloseProp && onCloseProp();
    }

    useEffect(() => {
        Object.keys(programa).length > 0 && setProgramaNombre(programa.nombre);
    }, [programa]);

    useEffect(() => {
        Object.keys(jornada).length > 0 && setJornadaNombre(jornada.tipo);
    }, [jornada]);

    useEffect(() => {
        Object.keys(responsable).length > 0 && setResponsableNombre(responsable.nombre);
    }, [responsable]);

    const ManjearChecksRadio = (e) => {
        const valor = e.target.value;
        if (valor === 'si') setEsCadena(true);
        else if (valor === 'no') setEsCadena(false);
    }

    const ManejarCantidadAprendices = (texto) => {
        if (texto.length > 2) setCantidadAprendices(texto.substring(0, 2));
        else setCantidadAprendices(texto);
    }

    const ManejarTrimestre = (texto) => {
        if (texto.length > 2) setTrimestreLectivo(texto.substring(0, 2));
        else setTrimestreLectivo(texto);
    }

    const ValidarObjGrupo = () => {
        let bandera = false;
        const idPrograma = programa.id;
        const idResponsable = responsable.id;
        const idJornada = jornada.id;
        if (!idPrograma || !idPrograma || !idPrograma.toString().trim() || !SoloNumeros(idPrograma)) {
            Swal.fire("Selección incorrecta de programa académico!");
            setPrograma({});
        }
        else if (!ficha || !ficha.toString().trim() || !HastaCincuenta(ficha) || !SoloNumeros(ficha)) {
            Swal.fire("Número de ficha incorrecto!");
            setFicha('');
        } else if (!codigoGrupo || !codigoGrupo.toString().trim() || !HastaCien(codigoGrupo) || !AlfaNumericaSinEspacio(codigoGrupo)) {
            Swal.fire("Código de grupo incorrecto");
            setCodigoGrupo('');
        } else if (!idResponsable || !idResponsable.toString().trim() || !SoloNumeros(idResponsable)) {
            Swal.fire("Selección incorrecta de instructor responsable!");
            setResponsable({});
        } else if (!idJornada || !idJornada.toString().trim() || !SoloNumeros(idJornada)) {
            Swal.fire("Selección de jornada incorrecta!");
            setJornada('');
        } else if (!cantidadAprendices.toString().trim() || !HastaDos(cantidadAprendices) || !SoloNumeros(cantidadAprendices)) {
            Swal.fire("Cantidad de aprendices incorrecta!");
            setCantidadAprendices('');
        } else if (!trimestreLectivo.toString().trim() || !HastaDos(trimestreLectivo) || !SoloNumeros(trimestreLectivo)) {
            Swal.fire("Trimestre lectivo incorrecto!!");
            setTrimestreLectivo('');
        } else if (!fechaInicio || !fechaInicio.toString().trim() || EsFecha(fechaInicio)) {
            Swal.fire("Fecha de inicio de trimestre incorrecta!");
            setFechaInicio('');
        } else if (!fechaFin || !fechaFin.toString().trim() || EsFecha(fechaFin)) {
            Swal.fire("Fecha de fin de trimestre incorrecta!");
            setFechaFin('');
        } else if (fechaFin < fechaInicio) {
            Swal.fire("Fecha final debería ser mayor que fecha inicial!");
        } else {
            bandera = true;
        }
        return bandera;
    }

    const FormarObjGrupo = () => {
        const objAux = {
            id: ficha,
            idPrograma: programa.id,
            idResponsable: responsable.id,
            codigoGrupo: FormatearCodigoGrupo(codigoGrupo),
            idJornada: jornada.id,
            cantidadAprendices: Number(cantidadAprendices),
            esCadenaFormacion: esCadena,
            trimestreLectivo: trimestreLectivo,
            fechaInicioTrimestre: fechaInicio,
            fechaFinTrimestre: fechaFin
        };
        setGrupo(objAux);
    }

    const ObjGrupoActualizado = () => {
        setGrupo({
            ...objConsulta,
            id: ficha,
            idPrograma: programa.id,
            nombrePrograma: programa.nombre,
            idResponsable: responsable.id,
            codigoGrupo: FormatearCodigoGrupo(codigoGrupo),
            idJornada: jornada.id,
            jornada: jornada.tipo,
            cantidadAprendices: Number(cantidadAprendices),
            esCadenaFormacion: esCadena,
            trimestreLectivo: trimestreLectivo,
            fechaInicioTrimestre: fechaInicio,
            fechaFinTrimestre: fechaFin
        });
    }

    const RegistrarGrupo = () => {
        if (ValidarObjGrupo()) {
            if (abrirConsulta) ObjGrupoActualizado();
            else FormarObjGrupo();
        }
    }

    function ReiniciarValores() {
        setPrograma(programaInicial);
        setFicha(fichaInicial);
        setCodigoGrupo(codigoInicial);
        setResponsable(responsableInicial);
        setJornada(jornadaInicial);
        setCantidadAprendices(aprendicesInicial);
        setEsCadena(esCadenaInicial);
    }

    useEffect(() => {
        if (!seActivoEdicion) ReiniciarValores();
    }, [seActivoEdicion]);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}
            onClickPositivo={RegistrarGrupo}>
            <div className='seccCajitasModal'>
                <section>
                    <label>programa: </label>
                    <button disabled={inputsOff} onClick={() => setSeleccPrograma(true)}>
                        {programaNombre}</button>
                </section>
                <section>
                    <label>ficha: </label>
                    <input type='number' disabled={inputsOff} value={ficha}
                        onChange={(e) => setFicha(e.target.value)} />
                </section>
                <section>
                    <label>código grupo: </label>
                    <input maxLength={100} disabled={inputsOff} value={codigoGrupo}
                        onChange={(e) => setCodigoGrupo(e.target.value)} />
                </section>
                <section>
                    <label>responsable: </label>
                    <button disabled={inputsOff} onClick={() => setSeleccResponsable(true)} >
                        {responsableNombre}</button>
                </section>
                <section>
                    <label>jornada: </label>
                    <button disabled={inputsOff} onClick={() => setSeleccJornada(true)}
                    >{jornadaNombre}</button>
                </section>
                <section>
                    <label >número de aprendices: </label>
                    <input disabled={inputsOff} type='number'
                        title='cantidad de estudiantes en el grupo (número de dos dígitos)'
                        value={cantidadAprendices} onChange={(e) => ManejarCantidadAprendices(e.target.value)} />
                </section>
                <section>
                    <label >número de trimestre lectivo: </label>
                    <input disabled={inputsOff} type='number'
                        title='trimestre actual que cursa el grupo (número de dos dígitos)'
                        value={trimestreLectivo} onChange={(e) => ManejarTrimestre(e.target.value)} />
                </section>
                <section>
                    <label >fecha incio trimestre: </label>
                    <input disabled={inputsOff} type='date'
                        title='fecha en que inicia el trimestre lectivo del grupo'
                        value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                </section>
                <section>
                    <label >fecha fin trimestre: </label>
                    <input disabled={inputsOff} type='date'
                        title='fecha en que finaliza el trimestre lectivo del grupo'
                        value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                </section>
                <section>
                    <label >es cadena de formación: </label>
                    <div className='contRadios'>
                        <label>
                            si<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks'
                                value="si" checked={esCadena} onChange={ManjearChecksRadio} />
                        </label>
                        <label>
                            no<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks'
                                value="no" checked={!esCadena} onChange={ManjearChecksRadio} />
                        </label>
                    </div>
                </section>
            </div>
            {
                seleccResponsable ? <CrudInstructores modoSeleccion={true}
                    onClose={() => setSeleccResponsable(false)}
                    responsableSeleccionado={(r) => setResponsable(r)} />
                    : null
            }
            {
                seleccPrograma ? <CrudPrograma modoSeleccion={true}
                    onClose={() => setSeleccPrograma(false)}
                    programaSeleccionado={(p) => setPrograma(p)} />
                    : null
            }
            {
                seleccJornada ? <CrudJornadas modoSeleccion={true}
                    onClose={() => setSeleccJornada(false)}
                    jornadaSeleccionada={(j) => setJornada(j)} />
                    : null
            }
        </ModalGeneral>
    );
}
export default ModalGrupos;