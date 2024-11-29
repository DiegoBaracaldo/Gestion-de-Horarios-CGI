import React, { useState } from 'react'
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica } from '../../mocks/mocksTablaBasica'
import ModalProgramas from '../../modales/modalProgramas/ModalProgramas.js';

function CrudPrograma() {
    const [abrirConsulta,setAbrirConsulta]= useState(false);  
    const [abrirRegistro,setAbrirRegistro]= useState(false);  

    const AbrirConsulta = () => {
      setAbrirConsulta(true);
    }
    const AbrirRegistro = () => {
      setAbrirRegistro(true);
    }

    const CerrarModal = () =>{
      setAbrirConsulta(false);
      setAbrirRegistro(false);

    }    
   
  return (
    <div id='contCrudJornadas'>
        <CrudBasico 
            nameFiltro={"Programas"}
            //busqueda={}
            esconderEntidad={true}
            entidad={"Programas"}
            propiedadTabla={mocksBasica}
            onClickPositivo={AbrirRegistro}
            clic={AbrirConsulta}
           
          
            />
            {
              abrirConsulta || abrirRegistro ? 
              <ModalProgramas abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro} 
              cerrarModal={()=>CerrarModal()}/>
              : null
            }

           
            
    </div>
  )
}

export default CrudPrograma