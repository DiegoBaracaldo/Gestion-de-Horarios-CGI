import React, { useState } from 'react'
import './CrudJornadas.css'
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica2 } from '../../mocks/mocksTablaBasica'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria'
import ModalJornadas from '../../modales/modalJornadas/ModalJornadas'

function CrudJornadas() {
  const [abrirHorario,setAbrirHorario]= useState(false); 
  const [abrirRegistro,setAbrirRegistro]= useState(false); 
  const [abrirConsulta,setAbrirConsulta]= useState(false); 

 const CerrarModal = () => {
   setAbrirRegistro(false);
   setAbrirConsulta(false);
 }

  return (
    <div id='contCrudJornadas'>
        <CrudBasico
            entidad={"Jornadas"}
            propiedadTabla={mocksBasica2}
            esconderGeneral={true}
            onClickPositivo={()=> setAbrirHorario(true)}
            clic={()=> setAbrirConsulta(true)}
        />

        {
          abrirConsulta || abrirRegistro ? <ModalJornadas cerrarModal={()=> CerrarModal()}
          abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}/> 
          : null
        }
        {
          abrirHorario? <FranjaHoraria onClickDestructivo={()=> setAbrirHorario(false)}/> 
          : null
        }
    </div>
  )
}

export default CrudJornadas