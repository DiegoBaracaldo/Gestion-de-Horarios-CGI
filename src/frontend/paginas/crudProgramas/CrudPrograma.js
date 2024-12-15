import React, { useEffect, useState } from 'react'
import './CrudProgramas.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica } from '../../mocks/mocksTablaBasica'
import ModalProgramas from '../../modales/modalProgramas/ModalProgramas.js';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

function CrudPrograma({ modoSeleccion, onClose, programaSeleccionado }) {
  const [abrirConsulta, setAbrirConsulta] = useState(false);
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [textoBuscar, setTextoBuscar] = useState('');
  const [filtrarPor, setFiltrarPor] = useState('todos');

  //Sección de hooks que recogen info del objeto a registrar
  const [fechaInicio, setFechaInicio] = useState(null);

  useEffect(() => {
    FiltrarPorTipo();
  }, [filtrarPor]);

  const CargarLista = () => {
    return new ProgramaServicio().CargarLista();
  }

  const [listaObjetos, setListaObjetos] = useState(CargarLista);
  const [listaFiltrada, setListaFiltrada] = useState(listaObjetos);
  const [listaFiltradaTecnologo, setListaFiltradaTecnologo] = useState(listaObjetos);
  const [listaFiltradaTecnico, setListaFiltradaTecnico] = useState(listaObjetos);
  const [listaFiltradaCurso, setListaFiltradaCurso] = useState(listaObjetos);
  const [listaAdaptada, setListaAdaptada] = useState([]);

  //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
  useEffect(() => {
    FiltrarPorTipo();
  }, [listaFiltrada]);

  useEffect(() => {
    if (filtrarPor === 'todos') AdaptarLista(listaFiltrada);
    if (filtrarPor === 'tecnico') AdaptarLista(listaFiltradaTecnico);
    if (filtrarPor === 'tecnologo') AdaptarLista(listaFiltradaTecnologo);
    if (filtrarPor === 'cursoCorto') AdaptarLista(listaFiltradaCurso);
  }, [listaFiltradaTecnologo]);

  const AdaptarLista = (listaRecibida) => {
    const listaAux = [];
    listaRecibida &&
      listaRecibida.map(element => {
        const objAux = {};
        objAux.id = element.id;
        objAux.tipo = element.tipo;
        objAux.nombre = element.nombre;
        objAux.cantidadTrimestres = element.cantidadTrimestres;
        objAux.fechaInicio = element.fechaInicio;
        objAux.fechaFin = element.fechaFin;
        objAux.fechaRegistro = element.fechaRegistro;
        listaAux.push(element);
      });
    setListaAdaptada(listaAux);
  }

  const FiltrarPorTipo = () => {
    const tecnologoAux = [];
    const tecnicoAux = [];
    const cursoAux = [];
    listaFiltrada.forEach(elemento => {
      if (elemento.tipo === 'tecnico') tecnicoAux.push(elemento);
      if (elemento.tipo === 'tecnologo') tecnologoAux.push(elemento);
      if (elemento.tipo === 'cursoCorto') cursoAux.push(elemento);
    });
    setListaFiltradaCurso(cursoAux);
    setListaFiltradaTecnico(tecnicoAux);
    setListaFiltradaTecnologo(tecnologoAux);
  }

  const AbrirConsulta = () => {
    setAbrirConsulta(true);
  }
  const AbrirRegistro = () => {
    setAbrirRegistro(true);
  }

  const CerrarModal = () => {
    setAbrirConsulta(false);
    setAbrirRegistro(false);

  }

  //constantes de opciones
  const opciones = ['Curso corto', 'Técnico', 'Tecnólogo'];
  const [listaVacia, setListaVacia] = useState(true);
  const [listaSelecciones, setListaSelecciones] = useState([]);
  const [listaSeleccRecibida, setListaSeleccRecibida] = useState([]);

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
    if(modoSeleccion){
      programaSeleccionado && programaSeleccionado(e);
      onClose();
    }else{
      AbrirConsulta();
    }
  }

  return (
    <div id='contCrudProgramas' style={modoSeleccion && { zIndex: 10 }}>
      <CrudBasico
        nameFiltro={"Programas"}
        busqueda={(t) => setTextoBuscar(t)}
        esconderEntidad={true}
        entidad={"Programas"}
        propiedadTabla={listaAdaptada}
        onClickPositivo={AbrirRegistro}
        clic={(e) => ManejarClickFila(e)}
        opciones={opciones}
        disabledDestructivo={listaVacia}
        listaSeleccionada={(lista) => setListaSelecciones(lista)}
        seleccFiltro={(t) => setFiltrarPor(t)}
        modoSeleccion={modoSeleccion}
        onClickDestructivo={OnClickDestructivo}
      />
      {
        abrirConsulta || abrirRegistro ?
          <ModalProgramas abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
            cerrarModal={() => CerrarModal()} />
          : null
      }



    </div>
  )
}

export default CrudPrograma