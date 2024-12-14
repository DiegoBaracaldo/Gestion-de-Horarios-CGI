import React, { useEffect, useState } from 'react'
import './CrudJornadas.css'
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica2 } from '../../mocks/mocksTablaBasica'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria'
import ModalJornadas from '../../modales/modalJornadas/ModalJornadas'
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

function CrudJornadas({modoSeleccion, onClose, jornadaSeleccionada}) {
  const [abrirHorario, setAbrirHorario] = useState(false);
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [abrirConsulta, setAbrirConsulta] = useState(false);

  const CargarLista = () => {
    return new JornadaServicio().CargarLista();
  }

  const [listaObjetos, setListaObjetos] = useState(CargarLista);
  const [listaFiltrada, setListaFiltrada] = useState(listaObjetos);
  const [listaAdaptada, setListaAdaptada] = useState([]);

  //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
  useEffect(() => {
    const listaAux = [];
    listaFiltrada &&
      listaFiltrada.map((element) => {
        const objAux = {};
        objAux.id = element.id;
        objAux.tipo = element.tipo;
        objAux.franjaDisponibilidad = element.franjaDisponibilidad;
        objAux.fechaRegistro = element.fechaRegistro;
        listaAux.push(element);
      });
    setListaAdaptada(listaAux);
  }, [listaFiltrada]);

  const CerrarModal = () => {
    setAbrirRegistro(false);
    setAbrirConsulta(false);
  }
  const [listaVacia, setListaVacia] = useState(true);
  const [listaSelecciones, setListaSelecciones] = useState([]);

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
      jornadaSeleccionada && jornadaSeleccionada(e);
      onClose();
    }else{
      setAbrirConsulta(true);
    }
  }

  return (
    <div id='contCrudJornadas' style={modoSeleccion && {zIndex: 10}}>
      <CrudBasico
        entidad={"Jornadas"}
        propiedadTabla={listaAdaptada}
        esconderGeneral={true}
        onClickPositivo={() => setAbrirHorario(true)}
        clic={(e) => ManejarClickFila(e)}
        disabledDestructivo={listaVacia}
        listaSeleccionada={(lista) => setListaSelecciones(lista)}
        modoSeleccion={modoSeleccion}
        onClickDestructivo={OnClickDestructivo}
      />

      {
        abrirConsulta || abrirRegistro ? <ModalJornadas cerrarModal={() => CerrarModal()}
          abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro} />
          : null
      }
      {
        abrirHorario ? <FranjaHoraria onClickDestructivo={() => setAbrirHorario(false)} />
          : null
      }
    </div>
  )
}

export default CrudJornadas