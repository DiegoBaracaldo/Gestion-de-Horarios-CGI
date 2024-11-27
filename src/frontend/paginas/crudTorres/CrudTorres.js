import React from 'react';
import './CrudTorres.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico';
import { mocksBasica } from '../../mocks/mocksTablaBasica';

function CrudTorres() {
  
  return (
    <div id='contCrudTorres'>
        <CrudBasico 
        entidad={"Torre"} 
        propiedadTabla={mocksBasica} 
        nameFiltro={"Filtro Por Nombre"}
        esconderOpciones={true}
        // busqueda={} espacio libre para busqueda por medio de variables
         />
        
    </div>
  )
}

export default CrudTorres