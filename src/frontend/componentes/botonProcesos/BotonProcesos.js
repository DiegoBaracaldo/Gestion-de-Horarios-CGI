import { useEffect, useState } from 'react';
import './BotonProcesos.css';

const BotonProcesos = ({ texto, ruta, disabledProp, hiddenProp}) => {

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

    const manejarOnClick = () => {
        if(ruta){
            //Ir a la ruta asignada con prop "ruta"
            return;
        }else{
            alert("Este componente necesita una ruta...");
        }
    }

    return (
        <button id="btnProcesos" onClick={manejarOnClick} disabled={disabledHook} hidden={hiddenHook}
            className={clasesHook}>
            {texto}
        </button>
    );
}

export default BotonProcesos;