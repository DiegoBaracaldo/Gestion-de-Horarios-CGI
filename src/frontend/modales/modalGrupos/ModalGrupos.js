import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import CrudInstructores from '../../paginas/crudInstructores/CrudInstructores';
import CrudPrograma from '../../paginas/crudProgramas/CrudPrograma';
import CrudJornadas from '../../paginas/crudJornadas/CrudJornadas';
import { AlfaNumericaSinEspacio, CamposVacios, SoloNumeros } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien, HastaCincuenta, HastaDos } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import Grupo from '../../../backend/repository/entidades/Grupo';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';

const ModalGrupos = ({ abrirConsulta, abrirRegistro, onCloseProp, objConsulta }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    const CargarResponsableInicial = () => {
        return new InstructorServicio().CargarInstructor(objConsulta.idResponsable) || {};
    }

    const CargarProgramaInicial = () => {
        return new ProgramaServicio().CargarPrograma(objConsulta.idPrograma) || {};
    }

    const CargarJonadaInicial = () => {
        return new JornadaServicio().CargarJornada(objConsulta.idJornada) || {};
    }

    const [seleccResponsable, setSeleccResponsable] = useState(false);
    const responsableInicial = CargarResponsableInicial();
    const [responsable, setResponsable] = useState(responsableInicial);
    const [seleccPrograma, setSeleccPrograma] = useState(false);
    const programaInicial = CargarProgramaInicial()
    const [programa, setPrograma] = useState(programaInicial);
    const [seleccJornada, setSeleccJornada] = useState(false);
    const jornadaInicial = CargarJonadaInicial();
    const [jornada, setJornada] = useState(jornadaInicial);
    
    const fichaInicial = objConsulta.id &&  objConsulta.id;
    const [ficha, setFicha] = useState(fichaInicial);
    const codigoInicial = objConsulta.codigoGrupo &&  objConsulta.codigoGrupo;
    const [codigoGrupo, setCodigoGrupo] = useState(codigoInicial);
    const aprendicesInicial = objConsulta.cantidadAprendices &&  objConsulta.cantidadAprendices;
    const [cantidadAprendices, setCantidadAprendices] = useState(aprendicesInicial);
    const esCadenaInicial = objConsulta.esCadenaFormacion 
        && ( objConsulta.esCadenaFormacion === 1 ? true : false);
    const [esCadena, setEsCadena] = useState(esCadenaInicial);
    const [grupo, setGrupo] = useState({});

    const [programaNombre, setProgramaNombre] = useState("Seleccionar Programa...");
    const [jornadaNombre, setJornadaNombre] = useState("Seleccionar Jornada...");
    const [responsableNombre, setResponsableNombre] = useState("Seleccionar Responsable...");

    useEffect(() => {
        if(Object.keys(grupo).length > 0){
            const servicioGrupo = new GrupoServicio();
            if(abrirConsulta){
                servicioGrupo.ActualizarGrupo(fichaInicial, grupo);
                alert("Grupo actualizado correctamente!");
            }else{
                servicioGrupo.GuardarGrupo(grupo);
                alert("Grupo guardado correctamente!");
            }
            onCloseProp && onCloseProp();
        }
    }, [grupo]);

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
        if(valor === 'si') setEsCadena(true);
        else if(valor === 'no') setEsCadena(false);
    }

    const ManejarCantidadAprendices = (texto) => {
        if(texto.length > 2) setCantidadAprendices(texto.substring(0,2));
        else setCantidadAprendices(texto);
    }

    const ValidarObjGrupo = () => {
        let bandera = false;
        const idPrograma = programa.id;
        const idResponsable = responsable.id;
        const idJornada = jornada.id;
            if(!idPrograma || !idPrograma || !idPrograma.toString().trim() || !SoloNumeros(idPrograma)){
                alert("Selección incorrecta de programa académico!");
                setPrograma({});
            }
            else if(!ficha || !ficha.toString().trim() || !HastaCincuenta(ficha) || !SoloNumeros(ficha)){
                alert("Número de ficha incorrecto!");
                setFicha('');
            }else if(!codigoGrupo || !codigoGrupo.toString().trim() || !HastaCien(codigoGrupo) || !AlfaNumericaSinEspacio(codigoGrupo)){
                alert("Código de grupo incorrecto");
                setCodigoGrupo('');
            }else if(!idResponsable || !idResponsable.toString().trim() || !SoloNumeros(idResponsable)){
                alert("Selección incorrecta de instructor responsable!");
                setResponsable({});
            }else if(!idJornada || !idJornada.toString().trim() || !SoloNumeros(idJornada)){
                alert("Selección de jornada incorrecta!");
                setJornada('');
            }else if(!cantidadAprendices.toString().trim() || !HastaDos(cantidadAprendices) || !SoloNumeros(cantidadAprendices)){
                alert("Cantidad de aprendices incorrecta!");
                setCantidadAprendices('');
            }else{
                bandera = true;
            }
        return bandera;
    }

    const FormarObjGrupo = () => {
        const objAux = new Grupo(
            ficha,
            programa.id,
            responsable.id,
            codigoGrupo.toString().trim(),
            jornada.id,
            cantidadAprendices,
            esCadena,
            "2024-12-07T14:55:00",
            programa.nombre.toString().trim(),
            jornada.tipo.toString().trim(),
            responsable.nombre.toString().trim()
        );
        setGrupo(objAux);
    }

    const ObjGrupoActualizado = () => {
        setGrupo({
            ...objConsulta,
            id: ficha,
            idPrograma: programa.id,
            nombrePrograma: programa.nombre,
            idResponsable: responsable.id,
            codigoGrupo: codigoGrupo,
            idJornada: jornada.id,
            jornada: jornada.tipo,
            cantidadAprendices: cantidadAprendices,
            esCadenaFormacion: esCadena
        });
    }

    const RegistrarGrupo = () => {
        if(ValidarObjGrupo()){
            if(abrirConsulta) ObjGrupoActualizado();
            else FormarObjGrupo();
        }
    }

    function ReiniciarValores(){
        setPrograma(programaInicial);
        setFicha(fichaInicial);
        setCodigoGrupo(codigoInicial);
        setResponsable(responsableInicial);
        setJornada(jornadaInicial);
        setCantidadAprendices(aprendicesInicial);
        setEsCadena(esCadenaInicial);
    }

    useEffect(() => {
        if(!seActivoEdicion)ReiniciarValores();
    }, [seActivoEdicion]);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
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
                    onChange={(e) => setFicha(e.target.value)}/>
                </section>
                <section>
                    <label>código grupo: </label>
                    <input maxLength={100} disabled={inputsOff} value={codigoGrupo}
                    onChange={(e) => setCodigoGrupo(e.target.value)}/>
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
                        value={cantidadAprendices} onChange={(e) => ManejarCantidadAprendices(e.target.value)}/>
                </section>
                <section>
                    <label >es cadena de formación: </label>
                    <div className='contRadios'>
                        <label>
                            si<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks' 
                            value="si" checked={esCadena} onChange={ManjearChecksRadio}/>
                        </label>
                        <label>
                            no<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks' 
                            value="no" checked={!esCadena} onChange={ManjearChecksRadio}/>
                        </label>
                    </div>
                </section>
            </div>
            {
                seleccResponsable ? <CrudInstructores modoSeleccion={true} 
                onClose={() => setSeleccResponsable(false)}
                responsableSeleccionado={(r) => setResponsable(r)}/> 
                : null
            }
            {
                seleccPrograma ? <CrudPrograma modoSeleccion={true}
                onClose={() => setSeleccPrograma(false)}
                programaSeleccionado={(p) => setPrograma(p)}/>
                :null
            }
            {
                seleccJornada ? <CrudJornadas modoSeleccion={true}
                onClose={() => setSeleccJornada(false)}
                jornadaSeleccionada={(j) => setJornada(j)}/>
                :null
            }
        </ModalGeneral>
    );
}
export default ModalGrupos;