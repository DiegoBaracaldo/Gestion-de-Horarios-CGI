import React, { useEffect, useState } from 'react'
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
    
    //constantes de opciones
    const opciones = ['Curso corto', 'Técnico', 'Tecnólogo'];
    const [listaVacia, setListaVacia] = useState(true);
    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaSeleccRecibida, setListaSeleccRecibida] = useState([]);

    useEffect(() => {
      setListaVacia(listaSelecciones.length === 0);
    }, [listaSelecciones]);
   
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
            opciones={opciones}
            disabledDestructivo={listaVacia}
            listaSeleccionada={(lista) => setListaSelecciones(lista)}
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