import React, { useEffect, useState } from 'react'
import './CrudJornadas.css'
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica2 } from '../../mocks/mocksTablaBasica'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria'
import ModalJornadas from '../../modales/modalJornadas/ModalJornadas'
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

function CrudJornadas() {
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
        listaAux.push(element.tipo);
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

  return (
    <div id='contCrudJornadas'>
      <CrudBasico
        entidad={"Jornadas"}
        propiedadTabla={listaAdaptada}
        esconderGeneral={true}
        onClickPositivo={() => setAbrirHorario(true)}
        clic={() => setAbrirConsulta(true)}
        disabledDestructivo={listaVacia}
        listaSeleccionada={(lista) => setListaSelecciones(lista)}
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