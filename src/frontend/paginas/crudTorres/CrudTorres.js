import React, { useEffect, useState } from 'react';
import './CrudTorres.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico';
import { mocksBasica } from '../../mocks/mocksTablaBasica';
import ModalTorres from '../../modales/modalTorres/ModalTorres';
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

function CrudTorres() {
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
        listaAux.push(element.nombre);
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

  return (
    <div id='contCrudTorres'>
      <CrudBasico
        entidad={"Torre"}
        propiedadTabla={listaAdaptada}
        nameFiltro={"Filtro Por Nombre"}
        esconderOpciones={true}
        busqueda={(t) => setTextoBuscar(t)}
        clic={() => setAbrirEdicion(true)}
        disabledDestructivo={listaVacia}
        listaSeleccionada={(lista) => setListaSelecciones(lista)}
      />

      {
        abrirEdicion ? <ModalTorres cerrarModal={() => setAbrirEdicion(false)} /> :
          null
      }
    </div>

  )
}

export default CrudTorres