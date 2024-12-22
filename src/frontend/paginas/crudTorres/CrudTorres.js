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

  const CargarLista = () => {
    console.log("cargando lista...");
    return new TorreServicio().CargarLista();
  }

  const [listaObjetos, setListaObjetos] = useState(CargarLista);
  const [listaFiltrada, setListaFiltrada] = useState(listaObjetos);
  const [listaAdaptada, setListaAdaptada] = useState([]);

  useEffect(() => {
    const listaAux = [];
    listaFiltrada &&
      listaFiltrada.map((element) => {
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
    setTimeout(Filtrar, "50");
  }, [textoBuscar]);
  /*********************************************/

  useEffect(() => {
    setListaVacia(listaSelecciones.length === 0);
  }, [listaSelecciones]);

  const OnClickDestructivo = () => {
    if (modoSeleccion) {
      onClose && onClose();
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

  function RegistrarTorre(){
    if(textoAgregar){
      if(textoAgregar.trim() && HastaCien(textoAgregar) && TextoConEspacio(textoAgregar)){
        const objFormado = FormarObjetoTorre(FormatearNombre(textoAgregar));
        const servicioTorre = new TorreServicio();
        servicioTorre.GuardarTorre(objFormado);
        setListaFiltrada([...CargarLista()]);
        setReiniciarTexto(true);
      }else{
        setReiniciarTexto(true);
        alert("Dato incorrecto");
      }
    }else{
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
        objConsulta={torreConsultada}/> 
        :null
      }
    </div>

  )
}

export default CrudTorres