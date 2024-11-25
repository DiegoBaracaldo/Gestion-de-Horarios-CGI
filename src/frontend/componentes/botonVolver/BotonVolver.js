import { useEffect, useState } from 'react';
import './BotonVolver.css';
import { useNavigate } from 'react-router-dom';

const BotonVolver = ({ disabledProp, hiddenProp }) => {
    const navegar= useNavigate();
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

    //pendiente acomodar función para resetear valores al ir atrás y también al iniciar

    return (
        <button id="btnVolver" onClick={() => navegar(-1)} disabled={disabledHook} hidden={hiddenHook}
            className={clasesHook}>
            Atrás
        </button>
    );
}

export default BotonVolver;