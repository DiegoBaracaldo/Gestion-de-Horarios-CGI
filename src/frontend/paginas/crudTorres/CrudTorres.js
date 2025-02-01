import React, { useEffect, useState } from 'react';
import './CrudTorres.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico';
import { mocksBasica } from '../../mocks/mocksTablaBasica';
import ModalTorres from '../../modales/modalTorres/ModalTorres';
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { AlfaNumericaConEspacio, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SWALConfirm from '../../alertas/SWALConfirm';

function CrudTorres({ modoSeleccion, onClose, torreSeleccionada }) {
  const [abrirEdicion, setAbrirEdicion] = useState(false);
  const [torreConsultada, setTorreConsultada] = useState({});
  const [listaVacia, setListaVacia] = useState(true);
  const [listaSelecciones, setListaSelecciones] = useState([]);
  const [textoBuscar, setTextoBuscar] = useState('');
  const [textoAgregar, setTextoAgregar] = useState('');

  const [listaObjetos, setListaObjetos] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [listaAdaptada, setListaAdaptada] = useState([]);

  const [vaciarChecks, setVaciarChecks] = useState(false);

  const navegar = useNavigate();

  //Carga inicial de objetos
  const CargarListaInicial = async () => {
    console.log("cargando lista...");
    try {
      setListaObjetos(await new TorreServicio().CargarLista());
    } catch (error) {
      Swal.fire(error);
      navegar(-1);
    }
  }

  //Cada que el modal de edición está cerrado (carga inicial)
  useEffect(() => {
    CargarListaInicial();
  }, []);

  //Cuando cambia la lista de objetos inicial
  useEffect(() => {
    setListaFiltrada(listaObjetos);
  }, [listaObjetos]);

  useEffect(() => {
    const listaAux = [];
    Array.isArray(listaFiltrada) &&
      listaFiltrada.forEach((element) => {
        const objAux = {};
        objAux.id = element.id;
        objAux.nombre = element.nombre;
        objAux.fechaRegistro = element.fechaRegistro;
        listaAux.push(element);
      });
    setListaAdaptada(listaAux);
  }, [listaFiltrada]);

  /*************** SECCIÓN FILTRO **************/
  const Filtrar = () => {
    setListaFiltrada(FiltroGeneral('nombre', textoBuscar, listaObjetos));
  }

  useEffect(() => {
    if (listaObjetos.length > 0) setTimeout(Filtrar, "50");
  }, [textoBuscar]);
  /*********************************************/

  useEffect(() => {
    setListaVacia(listaSelecciones.length === 0);
  }, [listaSelecciones]);

  const OnClickDestructivo = () => {
    if (modoSeleccion) {
      onClose && onClose();
    } else {
      EliminarTorres();
    }
  }

  async function EliminarTorres() {
    const confirmar = await new SWALConfirm()
      .ConfirmAlert(`Al eliminar las torres seleccionadas se ELIMINARÁN automáticamente
          los AMBIENTES asociados a la torre. ¿Continuar?`);
    if (confirmar === 'si') {
      try {
        const servicioTorre = new TorreServicio();
        const auxListaID = listaSelecciones.map(torre => parseInt(torre.id.toString()));
        const respuesta = await servicioTorre.EliminarTorre(auxListaID);
        if (respuesta !== 0) ResultadoOperacion("Torres eliminadas satisfactoriamente!");
        else ResultadoOperacion("NO se eliminaron las torres!");
      } catch (error) {
        Swal.fire(error);
      }
      CargarListaInicial();
      setVaciarChecks(true);
    } else {
      return null;
    }
  }

  const ManejarClickFila = (e) => {
    if (modoSeleccion) {
      torreSeleccionada && torreSeleccionada(e);
      onClose();
    } else {
      setTorreConsultada(e);
      setAbrirEdicion(true);
    }
  }

  const OnClickPositivo = () => {
    RegistrarTorre();
  }

  /********** SECCIÓN DE REGISTRO ********************************************************************/
  const [reiniciarTexto, setReiniciarTexto] = useState(false);

  function RegistrarTorre() {
    if (textoAgregar) {
      if (textoAgregar
        && textoAgregar.toString().trim()
        && HastaCien(textoAgregar)
        && AlfaNumericaConEspacio(textoAgregar)) {
        GuardarTorre(FormatearNombre(textoAgregar));
      } else {
        Swal.fire("Dato incorrecto");
        setReiniciarTexto(true);
      }
    } else {
      Swal.fire("Valor inválido");
    }
  }

  async function GuardarTorre(nombre) {
    try {
      const servicioTorre = new TorreServicio();
      const respuesta = await servicioTorre.GuardarTorre(nombre);
      ResultadoOperacion(respuesta !== 0 ? ("Éxito al guardar torre nueva!")
        : ("NO se guardó la torre nueva!"));
    } catch (error) {
      ResultadoOperacion(error);
    }
  }

  useEffect(() => {
    if (reiniciarTexto) setReiniciarTexto(false);
  }, [reiniciarTexto]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  const CerrarModal = () => {
    setAbrirEdicion(false)
    setTorreConsultada({});
    CargarListaInicial();
  }

  function ResultadoOperacion(mensaje) {
    CargarListaInicial();
    setReiniciarTexto(true);
    Swal.fire(mensaje);
  }

  return (
    <div id='contCrudTorres' style={modoSeleccion && { zIndex: 10 }}>
      <CrudBasico
        entidad={"Torre"}
        propiedadTabla={listaAdaptada}
        nameFiltro={"Filtro Por Nombre"}
        esconderOpciones={true}
        busqueda={(t) => setTextoBuscar(t)}
        clic={(e) => ManejarClickFila(e)}
        disabledDestructivo={listaVacia}
        listaSeleccionada={(lista) => setListaSelecciones(lista)}
        onClickDestructivo={OnClickDestructivo}
        modoSeleccion={modoSeleccion}
        agregar={(t) => setTextoAgregar(t)}
        onClickPositivo={OnClickPositivo}
        reiniciarTextoAgregar={reiniciarTexto}
        vaciarChecks={vaciarChecks}
      />

      {
        abrirEdicion ? <ModalTorres cerrarModal={CerrarModal}
          objConsulta={torreConsultada} />
          : null
      }
    </div>

  )
}

export default CrudTorres