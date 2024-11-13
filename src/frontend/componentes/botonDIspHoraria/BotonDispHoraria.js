import { useEffect, useState } from 'react';
import './BotonDispHoraria.css';

const BotonDispHoraria = ({ disabledProp, hiddenProp}) => {

    const [disabledHook, setDisabledHook] = useState(false);
    const [hiddenHook, setHiddenHook] = useState(false);
    const [clasesHook, setClasesHook] = useState("btnOn");

    useEffect(() => {
        if (disabledProp !== null || disabledProp !== undefined){
            if(disabledProp) setClasesHook("btnOff");
            else setClasesHook("btnOn");
            setDisabledHook(disabledProp);
        }
    }, [disabledProp]);

    useEffect(() => {
        if (hiddenProp !== null || hiddenProp !== undefined) setHiddenHook(hiddenProp);
    }, [hiddenProp]);

    const manejarClick  = () => {
        //Función para abrir modal de disponibilidad horaria
        return;
    }

    return (
        <button id="btnDispHoraria" onClick={manejarClick} disabled={disabledHook} hidden={hiddenHook}
            className={clasesHook}>
            disponibilidad horaria
        </button>
    );
}

export default BotonDispHoraria;