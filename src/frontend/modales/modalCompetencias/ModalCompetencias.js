import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import { HastaCincuenta, HastaDos, HastaDoscientosCuarentaYNueve } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { SoloNumeros } from '../../../backend/validacion/ValidacionFormato';
import Competencia from '../../../backend/repository/entidades/Competencia';
import { FormatearDescripcion } from '../../../backend/formato/FormatoDatos';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';

const ModalCompetencias = ({ abrirConsulta, abrirRegistro, onCloseProp, programa }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [horas, setHoras] = useState('');
    const [competencia, setCompetencia] = useState({});

    useEffect(() => {
        if(Object.keys(competencia).length > 0){
            const competenciaService = new CompetenciaServicio();
            competenciaService.GuardarCompetencia(competencia);
            alert("Competencia guardada correctamente!");
            onCloseProp && onCloseProp();
        }
    });

    const ValidarObjCompetencia = () => {
        let bandera = false;
        const idPrograma = programa.id || '';
        if(!idPrograma || !idPrograma.toString().trim() || !HastaCincuenta(idPrograma) || !SoloNumeros(idPrograma)){
            alert("Programa seleccionado incorrectamente!");
        }else if(!codigo || !codigo.toString().trim() || !HastaCincuenta(codigo) || !SoloNumeros(codigo)){
            alert("Número de Ficha incorrecto!");
            setCodigo('');
        }else if(!descripcion || !descripcion.toString().trim() || !HastaDoscientosCuarentaYNueve(descripcion)){
            alert("Descripción incorrecta!");
        }else if(!horas || !horas.toString().trim() || !HastaDos(horas) || !SoloNumeros(horas)){
            alert("Cantidad de horas incorrecta!");
        }else{
            bandera = true;
        }

        return bandera;
    }

    const FormarObjCompetencia = () => {
        const competencia = new Competencia(
            codigo,
            programa.id,
            descripcion,
            horas,
            "2024-12-07T14:55:00",
            programa.nombre
        );
        setCompetencia(competencia);
    }

    const RegistrarCompetencia = () => {
        if(ValidarObjCompetencia()){
            FormarObjCompetencia();
        }
    }

    const ManejarHoras = (texto) => {
        setHoras(texto.substring(0, 2));
    }

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}
            onClickPositivo={RegistrarCompetencia}>
            <div className='seccCajitasModal'>
                <section>
                    <label>código: </label>
                    <input type='number' disabled={inputsOff} value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}/>
                </section>
                <section>
                    <label>descripción: </label>
                    <textarea maxLength={249} disabled={inputsOff} 
                    title='Descripción de la competencia' value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}/>
                </section>
                <section>
                    <label>horas requeridas por semana: </label>
                    <input type='number' disabled={inputsOff} value={horas}
                    onChange={(e) => ManejarHoras(e.target.value)}/>
                </section>
            </div>
        </ModalGeneral>
    );
}
export default ModalCompetencias;