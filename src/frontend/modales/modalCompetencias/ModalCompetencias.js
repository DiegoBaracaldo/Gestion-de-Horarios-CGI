import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import { HastaCincuenta, HastaDos, HastaDoscientosCuarentaYNueve } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { SoloNumeros } from '../../../backend/validacion/ValidacionFormato';
import Competencia from '../../../backend/repository/entidades/Competencia';
import { FormatearDescripcion } from '../../../backend/formato/FormatoDatos';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';

const ModalCompetencias = ({ abrirConsulta, abrirRegistro, onCloseProp, programa, objConsulta }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    const codigoInicial = objConsulta.id || '';
    const [codigo, setCodigo] = useState(codigoInicial);
    const descripcionInicial = objConsulta.descripcion || '';
    const [descripcion, setDescripcion] = useState(descripcionInicial);
    const horasInicial = objConsulta.horasRequeridas || '';
    const [horas, setHoras] = useState(horasInicial);
    const [competencia, setCompetencia] = useState({});

    useEffect(() => {
        if (Object.keys(competencia).length > 0) {
            Registrar();
        }
    }, [competencia]);

    async function Registrar() {
        try {
            const competenciaService = new CompetenciaServicio();
            const respuesta = abrirConsulta ?
                await competenciaService.ActualizarCompetencia(codigoInicial, competencia) :
                await competenciaService.GuardarCompetencia(competencia);
            alert(respuesta !== 0 ? ("Competencia guardada correctamente!") : ("NO se guardó la competencia!"));
        } catch (error) {
            alert(error);
        }

        onCloseProp && onCloseProp();
    }

    const ValidarObjCompetencia = () => {
        let bandera = false;
        const idPrograma = programa.id || '';
        if (!idPrograma || !idPrograma.toString().trim() || !HastaCincuenta(idPrograma) || !SoloNumeros(idPrograma)) {
            alert("Programa seleccionado incorrectamente!");
        } else if (!codigo || !codigo.toString().trim() || !HastaCincuenta(codigo) || !SoloNumeros(codigo)) {
            alert("Código de competencia incorrecto!");
            setCodigo('');
        } else if (!descripcion || !descripcion.toString().trim() || !HastaDoscientosCuarentaYNueve(descripcion)) {
            alert("Descripción incorrecta!");
        } else if (!horas || !horas.toString().trim() || !HastaDos(horas) || !SoloNumeros(horas)) {
            alert("Cantidad de horas incorrecta!");
        } else {
            bandera = true;
        }

        return bandera;
    }

    const FormarObjCompetencia = () => {
        const competencia = {
            id: codigo,
            idPrograma: programa.id,
            descripcion: FormatearDescripcion(descripcion),
            horasRequeridas: Number(horas)
        };
        setCompetencia(competencia);
    }

    const ObjCompetenciaActualizado = () => {
        setCompetencia({
            ...objConsulta,
            id: codigo,
            idPrograma: programa.id,
            descripcion: FormatearDescripcion(descripcion),
            horasRequeridas: Number(horas)
        });
    }

    const RegistrarCompetencia = () => {
        if (ValidarObjCompetencia()) {
            if (abrirConsulta) ObjCompetenciaActualizado();
            else FormarObjCompetencia();
        }
    }

    const ManejarHoras = (texto) => {
        setHoras(texto.substring(0, 2));
    }


    function ReiniciarValores() {
        setCodigo(codigoInicial);
        setDescripcion(descripcionInicial);
        setHoras(horasInicial);
    }

    useEffect(() => {
        if (!seActivoEdicion) ReiniciarValores();
    }, [seActivoEdicion]);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}
            onClickPositivo={RegistrarCompetencia}>
            <div className='seccCajitasModal'>
                <section>
                    <label>código: </label>
                    <input type='number' disabled={inputsOff} value={codigo}
                        onChange={(e) => setCodigo(e.target.value)} />
                </section>
                <section>
                    <label>descripción: </label>
                    <textarea maxLength={249} disabled={inputsOff}
                        title='Descripción de la competencia' value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)} />
                </section>
                <section>
                    <label>horas requeridas por semana: </label>
                    <input type='number' disabled={inputsOff} value={horas}
                        onChange={(e) => ManejarHoras(e.target.value)} />
                </section>
            </div>
        </ModalGeneral>
    );
}
export default ModalCompetencias;