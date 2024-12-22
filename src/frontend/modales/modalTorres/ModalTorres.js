import React, { useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral'


function ModalTorres({cerrarModal, objConsulta}) {

  const [nombreTorre, setNombreTorre] = useState(objConsulta && objConsulta.nombre);

  return (
    <ModalGeneral  onClose={cerrarModal} isOpenRegistro={true} >
        <div className='seccCajitasModal'>
        <section >
            <label>
                Nombre: 
            </label>
            <input maxLength={100} value={nombreTorre} 
            onChange={(e) => setNombreTorre(e.target.value)}/>
        </section> 
        </div>
        

    </ModalGeneral>
  )
}

export default ModalTorres