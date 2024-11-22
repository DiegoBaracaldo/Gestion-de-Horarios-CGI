import { useEffect, useState } from 'react';
import './BotonProcesos.css';
import { useNavigate } from 'react-router-dom';

const BotonProcesos = ({ texto, ruta, disabledProp, hiddenProp}) => {

    const [disabledHook, setDisabledHook] = useState(false);
    const [hiddenHook, setHiddenHook] = useState(false);
    const [clasesHook, setClasesHook] = useState("btnOn");
    const navegar = useNavigate();

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
            navegar(ruta);
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