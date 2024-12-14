import React, { useEffect, useState } from 'react';
import './CrudTorres.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico';
import { mocksBasica } from '../../mocks/mocksTablaBasica';
import ModalTorres from '../../modales/modalTorres/ModalTorres';
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

function CrudTorres({modoSeleccion, onClose, torreSeleccionada}) {
  const [abrirEdicion, setAbrirEdicion] = useState(false);
  const [listaVacia, setListaVacia] = useState(true);
  const [listaSelecciones, setListaSelecciones] = useState([]);
  const [textoBuscar, setTextoBuscar] = useState('');

  const CargarLista = () => {
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
    if(modoSeleccion){
      onClose && onClose();
    }else{
      return null;
    }
  } 

  const ManejarClickFila = (e) => {
    if(modoSeleccion){
      torreSeleccionada && torreSeleccionada(e);
      onClose();
    }else{
      setAbrirEdicion(true);
    }
  }

  return (
    <div id='contCrudTorres' style={modoSeleccion && {zIndex: 10}}>
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
      />

      {
        abrirEdicion ? <ModalTorres cerrarModal={() => setAbrirEdicion(false)} /> :
          null
      }
    </div>

  )
}

export default CrudTorres