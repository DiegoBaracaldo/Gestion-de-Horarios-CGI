import { useEffect, useState } from 'react';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import './ModalGeneral.css';

const ModalGeneral = ({ children, hiddenPositivo, disabledPositivo,
    isOpenRegistro, isOpenConsulta, onClose, bloquearInputs, edicionActivada
}) => {

    const [modoEdicion, setModoEdicion] = useState(false);
    const [textoPositivo, setTextoPositivo] = useState('');

    //Manejar modo edición
    useEffect(() => {
        if (modoEdicion) {
            bloquearInputs && bloquearInputs(false);
            setTextoPositivo("Registrar");
            //para notificar al padre que se activó la edición por si le sirve la info
            edicionActivada && edicionActivada(true);
        } else {
            bloquearInputs && bloquearInputs(true);
            setTextoPositivo("Editar");
            //para notificar al padre que se activó la edición por si le sirve la info
            edicionActivada && edicionActivada(false);
        }
    }, [modoEdicion]);

    //Manejar apertura modo registro
    useEffect(() => {
        if (isOpenRegistro) {
            bloquearInputs && bloquearInputs(false);
            setTextoPositivo("Registrar");
        }
    }, [isOpenRegistro]);

    //Manejar apertura modo consulta
    useEffect(() => {
        if (isOpenConsulta) {
            bloquearInputs && bloquearInputs(true);
            setTextoPositivo("Editar");
        }
    }, [isOpenConsulta]);

    const ManejarOnClicPositivo = () => {
        if (isOpenRegistro) {
            Registrar();
        }
        if (isOpenConsulta) {
            if (!modoEdicion) setModoEdicion(true);
            else Registrar();
        }
    }

    const Registrar = () => {
        // lógica para registarr o editar al objeto
        alert("registrando");
    }

    const ManejarOnClicDestructivo = () => {
        if (modoEdicion) {
            //volver a modo consulta
            setModoEdicion(false);
        } else {
            ManejarOnClose();
        }
    }

    const ManejarOnClose = () => {

        // hay que reiniciar toda la información también
        setModoEdicion(false);
        onClose && onClose();
    }

    return (
        <div id='modalGeneralFondo'>
            <div id='modalGeneral'>
                {
                    /*Se debe agregar un div con className seccCajitasModal y cada etiqueta con su input
                    deben ir dentro de un section*/
                    children
                }
                <div className='seccBotonesModal'>
                    <div className='contBtnPositivo contBtn'>
                        <BotonPositivo onClick={ManejarOnClicPositivo} texto={textoPositivo}
                            hiddenProp={hiddenPositivo} disabledProp={disabledPositivo} />
                    </div>
                    <div className='contBtnDestructivo contBtn'>
                        <BotonDestructivo onClick={ManejarOnClicDestructivo} texto="cancelar" />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ModalGeneral;