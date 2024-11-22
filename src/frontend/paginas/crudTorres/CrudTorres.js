import React from 'react';
import './CrudTorres.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico';

function CrudTorres() {
  return (
    <div id='contCrudTorres'>
        <CrudBasico entidad={"Torre"}/>
    </div>
  )
}

export default CrudTorres