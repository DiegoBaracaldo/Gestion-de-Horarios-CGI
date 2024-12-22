import React, { useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
function ModalJornadas({abrirRegistro, abrirConsulta, cerrarModal, objConsulta
 }) {
    const [inputsOff,setInputsOff]= useState(false); 
    const [edicionActivada,setEdicionActivada]= useState(false); 
    const [abrirHorario,setAbrirHorario]= useState(false); 

    const [tipo, setTipo] = useState(objConsulta && objConsulta.tipo);
    const [horario, setHorario] = useState(objConsulta && objConsulta.franjaDisponibilidad);

  return (
    <ModalGeneral isOpenRegistro={abrirRegistro} isOpenConsulta={abrirConsulta}
    onClose={cerrarModal && cerrarModal} bloquearInputs={(valor)=> setInputsOff(valor)}
    edicionActivada={(valor)=>setEdicionActivada(valor)}>
        <div className='seccCajitasModal'>
        <section>
            <label>
                Tipo: 
            </label>
            <input maxLength={25} disabled={inputsOff} value={tipo}
            onChange={(e) => setTipo(e.target.value)}/>
        </section>
        <section>
            <label>
                Horario: 
            </label>
            <BotonDispHoraria esDisponibilidad={false} esConsulta={abrirConsulta} 
            edicionActivada={edicionActivada} onClicHorario={()=> setAbrirHorario(true)} />
        </section>
        </div>
        {
            abrirHorario ? <FranjaHoraria onClickDestructivo={()=> setAbrirHorario(false)}
            esConsulta={inputsOff}
            franjasOcupadasProp={horario}/>
            : null 
        }
    </ModalGeneral>

  )
}

export default ModalJornadas