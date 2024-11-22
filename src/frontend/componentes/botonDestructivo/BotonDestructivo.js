import { useEffect, useState } from 'react';
import './BotonDestructivo.css';

const BotonDestructivo = ({ texto, onClick, disabledProp, hiddenProp}) => {

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

    const PedirFuncionalidad = () => {
        alert("Agregar funcionalidad a este componente por favor...");
    }

    return (
        <button id="btnDestructivo" onClick={onClick ? onClick : PedirFuncionalidad} disabled={disabledHook} hidden={hiddenHook}
            className={clasesHook}>
            {texto}
        </button>
    );
}

export default BotonDestructivo;