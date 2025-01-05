import { useEffect, useState } from 'react';
import './BotonDispHoraria.css';

const BotonDispHoraria = ({ disabledProp, hiddenProp, esDisponibilidad, esConsulta,
    edicionActivada, onClicHorario, horarioSeleccionado
}) => {

    const [disabledHook, setDisabledHook] = useState(disabledProp);
    const [hiddenHook, setHiddenHook] = useState(hiddenProp);
    const [clasesHook, setClasesHook] = useState("btnOn");
    useEffect(() => {
        setDisabledHook(disabledProp);
    }, [disabledProp]);

    useEffect(() => {
        setHiddenHook(hiddenProp);
    }, [hiddenProp]);

    const [textoBtn, setTextoBtn] = useState('');

    useEffect(() => {
        //SI ES CONSULTA
        if (esConsulta) {
            //si se activó la edición
            if (edicionActivada) {
                //si la entidad maneja disponibilidad
                if (esDisponibilidad) {
                    setTextoBtn("definir disponibilidad");
                }
                //si la entidad maneja horario
                if (!esDisponibilidad) {
                    setTextoBtn("definir horario");
                }
            } else {
                //si la entidad maneja disponibilidad
                if (esDisponibilidad) {
                    setTextoBtn("ver disponibilidad");
                }
                //si la entidad maneja horario
                if (!esDisponibilidad) {
                    setTextoBtn("ver horario");
                }
            }
        }
        //SI ES REGISTRO
        else {
            //si la entidad maneja disponibilidad
            if (esDisponibilidad) {
                setTextoBtn("definir disponibilidad");
            }
            //si la entidad maneja horario
            if (!esDisponibilidad) {
                setTextoBtn("definir horario");
            }
        }
    }, [esConsulta, edicionActivada]);



    return (
        <button id="btnDispHoraria" onClick={typeof onClicHorario === 'function' ? ()  => onClicHorario() :
            ()  => alert("Agregar funcionalidad para abrir horario...!")}
            disabled={disabledHook} hidden={hiddenHook}
            className={clasesHook}
            style={{background: `${horarioSeleccionado ? '#CB7766' : '#385C57'}`}}>
            {textoBtn}
        </button>
    );
}

export default BotonDispHoraria;