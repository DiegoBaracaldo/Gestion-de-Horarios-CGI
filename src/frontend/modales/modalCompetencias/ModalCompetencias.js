import { useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';

const ModalCompetencias = ({ abrirConsulta, abrirRegistro, onCloseProp }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}>
            <div className='seccCajitasModal'>
                <section>
                    <label>código: </label>
                    <input type='number' disabled={inputsOff}/>
                </section>
                <section>
                    <label>descripción: </label>
                    <textarea maxLength={249} disabled={inputsOff} 
                    title='Descripción de la competencia'/>
                </section>
                <section>
                    <label>horas requeridas por semana: </label>
                    <input type='number' disabled={inputsOff} />
                </section>
            </div>
        </ModalGeneral>
    );
}
export default ModalCompetencias;