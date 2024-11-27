import { useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';

const ModalCompetencias = ({ abrirConsulta, abrirRegistro, onCloseProp }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    if (!abrirRegistro && !abrirConsulta) return null;
    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}>
            <div className='seccCajitasModal'>
                <section>
                    <label>código: </label>
                    <input maxLength={25} disabled={inputsOff}/>
                </section>
                <section>
                    <label>descripción: </label>
                    <textarea maxLength={45} disabled={inputsOff} 
                    title='Nombre completo'/>
                </section>
                <section>
                    <label>horas requeridas por semana: </label>
                    <input maxLength={3} disabled={inputsOff} />
                </section>
            </div>
        </ModalGeneral>
    );
}
export default ModalCompetencias;