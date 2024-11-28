import { useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
import { ocupanciaUno } from '../../mocks/MockFranjaHoraria';

const ModalInstructores = ({ abrirConsulta, abrirRegistro, onCloseProp }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    //Manejar modal de horario
    const [isOpenFranjaHoraria, setIsOpenFranjaHoraria] = useState(false);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}>
            <div className='seccCajitasModal'>
                <section>
                    <label>cédula: </label>
                    <input maxLength={15} disabled={inputsOff}
                        title='Sólo números, sin signos especiales' />
                </section>
                <section>
                    <label>nombre: </label>
                    <input maxLength={45} disabled={inputsOff}
                        title='Nombre completo' />
                </section>
                <section>
                    <label>correo: </label>
                    <input maxLength={45} disabled={inputsOff} />
                </section>
                <section>
                    <label>teléfono: </label>
                    <input maxLength={20} disabled={inputsOff} />
                </section>
                <section>
                    <label>especialidad: </label>
                    <input maxLength={45} disabled={inputsOff} />
                </section>
                <section>
                    <label>tope de horas: </label>
                    <input maxLength={2} disabled={inputsOff}
                        title='número de dos dígitos máximo' />
                </section>
                <section>
                    <label>horario: </label>
                    {/* Si no es disponibilidad, es horario, si no es consulta, es resgistro,
                    y la edición activada es para cambiar el texto según se edita o se cancela */}
                    <BotonDispHoraria esDisponibilidad={true} esConsulta={abrirConsulta}
                        edicionActivada={seActivoEdicion}
                        onClicHorario={() => setIsOpenFranjaHoraria(true)} />
                </section>
            </div>
            {
                !isOpenFranjaHoraria ? null :
                    <FranjaHoraria isOpen={isOpenFranjaHoraria}
                        onClickDestructivo={() => setIsOpenFranjaHoraria(false)} 
                        esConsulta={inputsOff} franjasOcupadasProp={ocupanciaUno}/>
            }
        </ModalGeneral>
    );
}
export default ModalInstructores;