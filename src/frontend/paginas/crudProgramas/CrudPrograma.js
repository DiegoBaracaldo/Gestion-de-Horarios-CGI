import React, { useEffect, useState } from 'react'
import './CrudProgramas.css';
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica } from '../../mocks/mocksTablaBasica'
import ModalProgramas from '../../modales/modalProgramas/ModalProgramas.js';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SWALConfirm from '../../alertas/SWALConfirm.js';

function CrudPrograma({ modoSeleccion, onClose, programaSeleccionado }) {
  const [abrirConsulta, setAbrirConsulta] = useState(false);
  const [programaConsultado, setprogramaConsultado] = useState({});
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [textoBuscar, setTextoBuscar] = useState('');
  const [filtrarPor, setFiltrarPor] = useState('todos');

  const [vaciarChecks, setVaciarChecks] = useState(false);

  useEffect(() => {
    FiltrarPorTipo();
  }, [filtrarPor]);

  const navegar = useNavigate();

  const CargarLista = async () => {
    console.log("cargando lista...");
    try {
      setListaObjetos(await new ProgramaServicio().CargarLista());
    } catch (error) {
      Swal.fire(error);
      navegar(-1);
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
    Array.isArray(listaFiltrada) &&
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
    if (listaObjetos.length > 0) setTimeout(Filtrar, "50");
  }, [textoBuscar]);
  //////////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    setListaVacia(listaSelecciones.length === 0);
  }, [listaSelecciones]);

  const OnClickDestructivo = () => {
    if (modoSeleccion) {
      onClose && onClose();
    } else {
      EliminarProgramas();
    }
  }

  async function EliminarProgramas() {
    const confirmar = await new SWALConfirm()
      .ConfirmAlert(`Si continúa se eliminarán los GRUPOS y las COMPETENCIAS asociadas
        a los programas seleccionados. ¿Continuar?`);
    if (confirmar === 'si') {
      try {
        const servicioPrograma = new ProgramaServicio();
        const auxListaID = listaSelecciones.map(programa => parseInt(programa.id.toString()));
        const respuesta = await servicioPrograma.EliminarPrograma(auxListaID);
        Swal.fire(respuesta !== 0 ? ("Programas eliminados satisfactoriamente!: ")
          : ("NO se eliminaron los programas!"));
      } catch (error) {
        Swal.fire(error);
      }
      CargarLista();
      setVaciarChecks(true);
    } else {
      return null;
    }
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
        vaciarChecks={vaciarChecks}
      />
      {
        abrirConsulta || abrirRegistro ?
          <ModalProgramas abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
            cerrarModal={() => CerrarModal()} objConsulta={programaConsultado} />
          : null
      }
    </div>
  )
}

export default CrudPrograma