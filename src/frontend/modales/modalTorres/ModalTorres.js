import React, { useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral'
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import { CamposVacios, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';


function ModalTorres({ cerrarModal, objConsulta }) {

  const [nombreTorre, setNombreTorre] = useState(objConsulta.nombre || '');
  const idViejo = objConsulta.id || '';

  const ActualizarTorre = async () => {
    if (ValidarObjTorre()) {
      try {
        const torreService = new TorreServicio();
        const respuesta = await torreService.ActualizarTorre(idViejo, ObtenerObjActualizado());
        if (respuesta !== 0) ResultadoOperacion("Torre guardada correctamente!");
        else ResultadoOperacion("NO se guardó la torre!");
      } catch (error) {
        alert(error);
      }
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
    if (!CamposVacios(objConsulta)) {
      if (!nombreTorre || !nombreTorre.toString().trim() || !HastaCien(nombreTorre) || !TextoConEspacio(nombreTorre)) {
        alert("Nombre incorrecto!");
        setNombreTorre('');
      } else {
        bandera = true;
      }
    } else {
      alert("Datos incorrectos!");
    }
    return bandera;
  }

  function ResultadoOperacion(mensaje) {
    alert(mensaje);
    cerrarModal && cerrarModal();
  }

  return (
    <ModalGeneral onClose={cerrarModal} isOpenRegistro={true}
      onClickPositivo={ActualizarTorre}>
      <div className='seccCajitasModal'>
        <section >
          <label>
            Nombre:
          </label>
          <input maxLength={100} value={nombreTorre}
            onChange={(e) => setNombreTorre(e.target.value)} />
        </section>
      </div>


    </ModalGeneral>
  )
}

export default ModalTorres