import { useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';

const ModalGrupos = ({ abrirConsulta, abrirRegistro, onCloseProp }) => {

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
                    <label>ficha: </label>
                    <input maxLength={20} disabled={inputsOff} />
                </section>
                <section>
                    <label>código grupo: </label>
                    <input maxLength={25} disabled={inputsOff} />
                </section>
                <section>
                    <label>responsable: </label>
                    <button disabled={inputsOff} >Seleccionar...</button>
                </section>
                <section>
                    <label>jornada: </label>
                    <button disabled={inputsOff} >Seleccionar...</button>
                </section>
                <section>
                    <label >número de aprendices: </label>
                    <input maxLength={2} disabled={inputsOff}
                        title='cantidad de estudiantes en el grupo (número de dos dígitos)' />
                </section>
                <section>
                    <label >es cadena de formación: </label>
                    <div className='contRadios'>
                    <label>
                        si<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks' />
                    </label>
                    <label>
                        no<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks' />
                    </label>
                    </div>
                </section>
            </div>
        </ModalGeneral>
    );
}
export default ModalGrupos;