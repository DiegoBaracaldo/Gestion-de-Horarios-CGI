import React, { useState } from 'react';
import './CrudTorres.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico';
import { mocksBasica } from '../../mocks/mocksTablaBasica';
import ModalTorres from '../../modales/modalTorres/ModalTorres';

function CrudTorres() {
  const [abrirEdicion,setAbrirEdicion]= useState(false); 

  return (
    <div id='contCrudTorres'>
        <CrudBasico 
        entidad={"Torre"} 
        propiedadTabla={mocksBasica} 
        nameFiltro={"Filtro Por Nombre"}
        esconderOpciones={true}
        // busqueda={} espacio libre para busqueda por medio de variables
        clic={()=> setAbrirEdicion(true)}
        
         />
        
        {
          abrirEdicion ? <ModalTorres cerrarModal={()=> setAbrirEdicion(false)}/>: 
          null
        }
    </div>

  )
}

export default CrudTorres