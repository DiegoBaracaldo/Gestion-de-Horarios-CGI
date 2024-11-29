import React, { useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';

function ModalProgramas({abrirRegistro, abrirConsulta, cerrarModal}) {
  const [inputsOff,setInputsOff]= useState(false); 

 
    
  return (
    <div>
        <ModalGeneral isOpenRegistro={abrirRegistro} isOpenConsulta={abrirConsulta}
        onClose={cerrarModal && (() => cerrarModal() )}
        bloquearInputs={(valor)=>setInputsOff(valor)}
        >

          <div className='seccCajitasModal'>
          <section>
                <label>
                    Còdigo: 
                </label>
                <input disabled={inputsOff} />
            </section>
            <section>
                <label>
                    Nombre: 
                </label>
                <input disabled={inputsOff} />
            </section>
            <section>
                <label>
                    Tipo: 
                </label>
                <select disabled={inputsOff}>
                  <option value={"cursoCorto"}>
                    Curso corto
                  </option>
                  <option value={"tecnico"}>
                    Tècnico
                  </option>
                  <option value={"tecnologo"}>
                    Tecnòlogo
                  </option>
                </select>
            </section>

            <section>
                <label>
                    Cantidad de trimestres: 
                </label>
                <input disabled={inputsOff}/>
            </section>

            <section>
                <label>
                    Fecha de inicio: 
                </label>
                <input type='date'  disabled={inputsOff}/>
            </section>

            <section>
                <label>
                    Fecha final: 
                </label>
                <input type='date'  disabled={inputsOff}/>
            </section>
            
          </div>
           
        </ModalGeneral>

    </div>
  )
}

export default ModalProgramas