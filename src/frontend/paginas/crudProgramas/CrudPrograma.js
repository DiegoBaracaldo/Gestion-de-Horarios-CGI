import React, { useEffect, useState } from 'react'
import './CrudProgramas.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica } from '../../mocks/mocksTablaBasica'
import ModalProgramas from '../../modales/modalProgramas/ModalProgramas.js';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

function CrudPrograma({ modoSeleccion, onClose, programaSeleccionado }) {
  const [abrirConsulta, setAbrirConsulta] = useState(false);
  const [programaConsultado, setprogramaConsultado] = useState({});
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [textoBuscar, setTextoBuscar] = useState('');
  const [filtrarPor, setFiltrarPor] = useState('todos');

  useEffect(() => {
    FiltrarPorTipo();
  }, [filtrarPor]);

  const CargarLista = async() => {
    console.log("cargando lista...");
    try {
      setListaObjetos(await new ProgramaServicio().CargarLista());
    } catch (error) {
      console.log("error en crud programas por: ", error);
      setListaObjetos([]);
    }
  }

  const [listaObjetos, setListaObjetos] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [listaFiltradaTecnologo, setListaFiltradaTecnologo] = useState([]);
  const [listaFiltradaTecnico, setListaFiltradaTecnico] = useState([]);
  const [listaFiltradaCurso, setListaFiltradaCurso] = useState([]);
  const [listaAdaptada, setListaAdaptada] = useState([]);

  useEffect(() => {
    setListaFiltrada(listaObjetos);
  }, [listaObjetos]);

  useEffect(() => {
    CargarLista();
  }, []);

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
      listaRecibida.forEach(element => {
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
    setprogramaConsultado({});
    CargarLista();
  }

  //constantes de opciones
  const opciones = ['Curso corto', 'Técnico', 'Tecnólogo'];
  const [listaVacia, setListaVacia] = useState(true);
  const [listaSelecciones, setListaSelecciones] = useState([]);


  /*************** SECCIÓN FILTRO *************************************************/
  const Filtrar = () => {
    setListaFiltrada(FiltroGeneral('nombre', textoBuscar, listaObjetos));
  }

  useEffect(() => {
    if(listaObjetos.length > 0)setTimeout(Filtrar, "50");
  }, [textoBuscar]);
  //////////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    setListaVacia(listaSelecciones.length === 0);
  }, [listaSelecciones]);

  const OnClickDestructivo = () => {
    if (modoSeleccion) {
      onClose && onClose();
    } else {
      const confirmar = window.confirm("¿Confirma que desea eliminar los programas académicos seleccionados!");
      if(confirmar){
        EliminarProgramas();
        alert("Programas eliminados correctamente!");
        CargarLista();
      }else{
        return null;
      }
    }
  }

  function EliminarProgramas(){
    const servicioPrograma = new ProgramaServicio();
    const listaAuxID = listaSelecciones.map(programa => programa.id);
    servicioPrograma.EliminarPrograma(listaAuxID);
  }

  const ManejarClickFila = (e) => {
    if (modoSeleccion) {
      programaSeleccionado && programaSeleccionado(e);
      onClose();
    } else {
      setprogramaConsultado(e);
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
            cerrarModal={() => CerrarModal()} objConsulta={programaConsultado}/>
          : null
      }
    </div>
  )
}

export default CrudPrograma