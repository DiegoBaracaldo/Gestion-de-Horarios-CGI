import { useState } from 'react';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import './ModalGeneral.css';

const ModalGeneral = ({ seccionCajitas, onClicPositivo, textoPositivo, hiddenPositivo, disabledPositivo,
    onClicDestructivo, textoDestructivo, hiddenDestructivo, disabledDestructivo
}) => {

    return (
        <div id='modalGeneralFondo'>
            <div id='modalGeneral'>
                {
                /*Se debe agregar un div con className seccCajitasModal y cada etiqueta con su input
                deben ir dentro de un section*/
                seccionCajitas && seccionCajitas
                }
                <div className='seccBotonesModal'>
                    <div className='contBtnPositivo contBtn'>
                        <BotonPositivo onClick={onClicPositivo} texto={textoPositivo }
                        hiddenProp={hiddenPositivo} disabledProp={disabledPositivo}/>
                    </div>
                    <div className='contBtnDestructivo contBtn'>
                        <BotonDestructivo onClick={onClicDestructivo} texto="cancelar"
                        hiddenProp={hiddenDestructivo} disabledProp={disabledDestructivo}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ModalGeneral;