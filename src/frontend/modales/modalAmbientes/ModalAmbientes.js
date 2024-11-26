import { useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';

const ModalAmbientes = ({ abrirConsulta, abrirRegistro, onCloseProp }) => {

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
                    <label>nombre: </label>
                    <input maxLength={45} disabled={inputsOff} 
                    title='Nombre del aula'/>
                </section>
                <section>
                    <label>torre: </label>
                    <button disabled={inputsOff} >seleccionar...</button>
                </section>
                <section>
                    <label>capacidad: </label>
                    <input maxLength={2} disabled={inputsOff} 
                    title='capacidad máxima de estudiantes posibles (2 dígitos)'/>
                </section>
                <section>
                    <label>horario: </label>
                    {/* Si no es disponibilidad, es horario, si no es consulta, es resgistro,
                    y la edición activada es para cambiar el texto según se edita o se cancela */}
                    <BotonDispHoraria esDisponibilidad={true} esConsulta={abrirConsulta} 
                    edicionActivada={seActivoEdicion}/>
                </section>
            </div>
        </ModalGeneral>
    );
}
export default ModalAmbientes;