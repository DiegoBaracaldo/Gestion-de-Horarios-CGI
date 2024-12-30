import React, { useEffect, useState } from 'react';
import './CrudTorres.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico';
import { mocksBasica } from '../../mocks/mocksTablaBasica';
import ModalTorres from '../../modales/modalTorres/ModalTorres';
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';

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

  //Carga inicial de objetos
  const CargarListaInicial = async () => {
    console.log("cargando lista...");
    try {
      setListaObjetos(await new TorreServicio().CargarLista());
    } catch (error) {
      console.log("error en crud torres por: ", error);
      setListaObjetos([]);
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
    listaFiltrada &&
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
    if(listaObjetos.length > 0)setTimeout(Filtrar, "50");
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

  function EliminarTorres() {
    const confirmar = window.confirm("¿Confirma que desea eliminar las torres seleccionadas?");
    if (confirmar) {
      const servicioTorre = new TorreServicio();
      const auxListaID = listaSelecciones.map(torre => torre.id);
      servicioTorre.EliminarTorre(auxListaID);
      alert("Torres eliminadas satisfactoriamente!");
      CargarListaInicial();
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
      if (textoAgregar && textoAgregar.toString().trim() && HastaCien(textoAgregar) && TextoConEspacio(textoAgregar)) {
        const objFormado = FormarObjetoTorre(FormatearNombre(textoAgregar));
        const servicioTorre = new TorreServicio();
        servicioTorre.GuardarTorre(objFormado);
        CargarListaInicial();
        setReiniciarTexto(true);
      } else {
        setReiniciarTexto(true);
        alert("Dato incorrecto");
      }
    } else {
      alert("Valor inválido");
    }
  }

  useEffect(() => {
    reiniciarTexto && setReiniciarTexto(false);
  }, [reiniciarTexto]);

  const FormarObjetoTorre = (nombre) => {
    const objAux = {};
    let numeroRandom = Math.floor(Math.random() * 900) + 100;
    objAux.id = numeroRandom;
    objAux.nombre = nombre;
    objAux.fechaRegistro = "2024-12-07T11:10:00";
    return objAux;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////

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
      />

      {
        abrirEdicion ? <ModalTorres cerrarModal={() => setAbrirEdicion(false)}
          objConsulta={torreConsultada} />
          : null
      }
    </div>

  )
}

export default CrudTorres