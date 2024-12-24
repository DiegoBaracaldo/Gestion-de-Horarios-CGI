import React, { useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral'
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import { CamposVacios, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';


function ModalTorres({cerrarModal, objConsulta}) {

  const [nombreTorre, setNombreTorre] = useState(objConsulta.nombre && objConsulta.nombre);
  const idViejo = objConsulta && objConsulta.id;

  const ActualizarTorre = () => {
    if(ValidarObjTorre()){

      const torreService = new TorreServicio();
      torreService.ActualizarTorre(idViejo, ObtenerObjActualizado());
      alert("Torre actualizada con éxito");
      cerrarModal && cerrarModal();
    }
  }

  const ObtenerObjActualizado = () => {
    return {
      ...objConsulta,
      nombre: FormatearNombre(nombreTorre)
    }
  }

  const ValidarObjTorre = () => {
    let bandera = false;
    if(!CamposVacios(objConsulta)){
      if(!nombreTorre || !nombreTorre.toString().trim() || !HastaCien(nombreTorre) || !TextoConEspacio(nombreTorre)){
        alert("Nombre incorrecto!");
        setNombreTorre('');
      }else{
        bandera = true;
      }
    }else{
      alert("Datos incorrectos!");
    }
    return bandera;
  }

  return (
    <ModalGeneral  onClose={cerrarModal} isOpenRegistro={true} 
    onClickPositivo={ActualizarTorre}>
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