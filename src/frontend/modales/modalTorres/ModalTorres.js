import React from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral'


function ModalTorres({cerrarModal}) {
  return (
    <ModalGeneral  onClose={cerrarModal} isOpenRegistro={true} >
        <div className='seccCajitasModal'>
        <section >
            <label>
                Nombre: 
            </label>
            <input/>
        </section> 
        </div>
        

    </ModalGeneral>
  )
}

export default ModalTorres