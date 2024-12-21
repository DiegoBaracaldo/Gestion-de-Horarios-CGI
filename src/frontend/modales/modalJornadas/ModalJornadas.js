import React, { useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
function ModalJornadas({abrirRegistro, abrirConsulta, cerrarModal
 }) {
    const [inputsOff,setInputsOff]= useState(false); 
    const [edicionActivada,setEdicionActivada]= useState(false); 
    const [abrirHorario,setAbrirHorario]= useState(false); 

  return (
    <ModalGeneral isOpenRegistro={abrirRegistro} isOpenConsulta={abrirConsulta}
    onClose={cerrarModal && cerrarModal} bloquearInputs={(valor)=> setInputsOff(valor)}
    edicionActivada={(valor)=>setEdicionActivada(valor)}>
        <div className='seccCajitasModal'>
        <section>
            <label>
                Tipo: 
            </label>
            <input maxLength={25} disabled={inputsOff}/>
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
            esConsulta={inputsOff}/>
            : null 
        }
    </ModalGeneral>

  )
}

export default ModalJornadas