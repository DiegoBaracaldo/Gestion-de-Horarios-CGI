import React from 'react'
import './CrudJornadas.css'
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica2 } from '../../mocks/mocksTablaBasica'


function CrudJornadas() {
  return (
    <div id='contCrudJornadas'>
        <CrudBasico
            entidad={"Jornadas"}
            propiedadTabla={mocksBasica2}
            esconderGeneral={true}
        />
    </div>
  )
}

export default CrudJornadas