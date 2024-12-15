import React, { useEffect, useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';

function ModalProgramas({abrirRegistro, abrirConsulta, cerrarModal}) {
  const [inputsOff,setInputsOff]= useState(false); 

//Se recogen los datos para el objeto que será registrado
const [fechaInicio, setFechaInicio] = useState(null);
useEffect(() => {
  console.log(fechaInicio);
}, [fechaInicio]);
 
    
  return (
    <div>
        <ModalGeneral isOpenRegistro={abrirRegistro} isOpenConsulta={abrirConsulta}
        onClose={cerrarModal && (() => cerrarModal() )}
        bloquearInputs={(valor)=>setInputsOff(valor)}
        >

          <div className='seccCajitasModal'>
          <section>
                <label>
                  Código: 
                </label>
                <input disabled={inputsOff} type='number'/>
            </section>
            <section>
                <label>
                    Nombre: 
                </label>
                <input disabled={inputsOff} maxLength={100}/>
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
                     Técnico
                  </option>
                  <option value={"tecnologo"}>
                      Tecnólogo
                  </option>
                </select>
            </section>

            <section>
                <label>
                    Cantidad de trimestres: 
                </label>
                <input disabled={inputsOff} type='number'/>
            </section>

            <section>
                <label>
                    Fecha de inicio: 
                </label>
                <input type='date'  disabled={inputsOff}
                onChange={(e) => setFechaInicio(e.target.value)}
                value={fechaInicio}/>
            </section>

            <section>
                <label>
                    Fecha final: 
                </label>
                <input type='date' disabled={inputsOff}/>
            </section>
            
          </div>
           
        </ModalGeneral>

    </div>
  )
}

export default ModalProgramas