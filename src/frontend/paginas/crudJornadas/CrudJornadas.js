import React, { useEffect, useState } from 'react'
import './CrudJornadas.css'
import CrudBasico from '../../componentes/crudBasico/CrudBasico'
import { mocksBasica2 } from '../../mocks/mocksTablaBasica'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria'
import ModalJornadas from '../../modales/modalJornadas/ModalJornadas'
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import { TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import SWALConfirm from '../../alertas/SWALConfirm'

function CrudJornadas({ modoSeleccion, onClose, jornadaSeleccionada }) {
  const [abrirHorario, setAbrirHorario] = useState(false);
  const [abrirRegistro, setAbrirRegistro] = useState(false);
  const [abrirConsulta, setAbrirConsulta] = useState(false);
  const [jornadaConsultada, setJornadaConsultada] = useState({});
  const [horarioEntero, setHorarioEntero] = useState([]);

  // useEffect(() => {
  //   console.log(horarioEntero);
  // }, [horarioEntero]);

  async function CargarHorarioCompleto(){
    try {
        const servicioJornada = new JornadaServicio();
        setHorarioEntero(await servicioJornada.CargarAllFranjas());
    } catch (error) {
        Swal.fire(error);
        if(typeof onClose ===  'function') onClose();
    }
}

  const [listaObjetos, setListaObjetos] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [listaAdaptada, setListaAdaptada] = useState([]);

  const [vaciarChecks, setVaciarChecks] = useState(false);

  const navegar = useNavigate();

  const CargarLista = async () => {
    console.log("cargando lista...");
    try {
      setListaObjetos(await new JornadaServicio().CargarLista());
    } catch (error) {
      Swal.fire(error);
      navegar(-1);
    }
  }

  useEffect(() => {
    CargarLista();
    CargarHorarioCompleto();
  }, []);

  useEffect(() => {
    setListaFiltrada(listaObjetos);
  }, [listaObjetos]);

  //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
  useEffect(() => {
    const listaAux = [];
    Array.isArray(listaFiltrada) &&
      listaFiltrada.forEach((element) => {
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
    setJornadaConsultada({});
    CargarLista();
  }
  const [listaVacia, setListaVacia] = useState(true);
  const [listaSelecciones, setListaSelecciones] = useState([]);
  const [textoAgregar, setTextoAgregar] = useState('');
  const [franjaHoraria, setFranjaHoraria] = useState([]);

  useEffect(() => {
    setListaVacia(listaSelecciones.length === 0);
  }, [listaSelecciones]);

  const OnClickDestructivo = () => {
    if (modoSeleccion) {
      onClose && onClose();
    } else {
      EliminarJornadas();
    }
  }

  async function EliminarJornadas() {
    const confirmar = await new SWALConfirm()
      .ConfirmAlert("¿Confirma que desea eliminar las jornadas seleccionadas?");
    if (confirmar) {
      try {
        const servicioJornada = new JornadaServicio();
        const auxListaID = listaSelecciones.map(jornada => parseInt(jornada.id.toString()));
        const respuesta = await servicioJornada.EliminarJornada(auxListaID);
        if (respuesta !== 0) ResultadoOperacion("Jornadas eliminadas satisfactoriamente!");
        else ResultadoOperacion("NO se eliminaron las jornadas!");
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
      jornadaSeleccionada && jornadaSeleccionada(e);
      onClose();
    } else {
      setJornadaConsultada(e);
      setAbrirConsulta(true);
    }
  }

  /********** SECCIÓN DE REGISTRO ********************************************************************/
  const [reiniciarTexto, setReiniciarTexto] = useState(false);

  const AbrirRegistroJornada = () => {
    if (textoAgregar) {
      if (textoAgregar.trim() && HastaCien(textoAgregar) && TextoConEspacio(textoAgregar)) {
        setAbrirHorario(true);
      } else {
        setReiniciarTexto(true);
        Swal.fire("Dato incorrecto");
      }
    } else {
      Swal.fire("Valor inválido");
    }
  }

  function RegistrarJornada() {
    if (franjaHoraria.length > 0) {
      setAbrirHorario(false);
      const objFormado = FormarObjeto(FormatearNombre(textoAgregar));
      GuardarJornada(objFormado);
    } else {
      Swal.fire("Debes establecer un rango horario para la jornada!");
    }

  }

  async function GuardarJornada(objetoFormado) {
    const servicioJornada = new JornadaServicio;
    const respuesta = await servicioJornada.GuardarJornada(objetoFormado);
    ResultadoOperacion(respuesta !== 0 ? ("Éxito al guardar jornada nueva!")
      : ("Error al guardar jornada nueva!"));
  }

  const CancelarRegistro = () => {
    setAbrirHorario(false);
    setFranjaHoraria([]);
    setReiniciarTexto(true);
  }

  useEffect(() => {
    reiniciarTexto && setReiniciarTexto(false);
  }, [reiniciarTexto]);

  const FormarObjeto = (tipo) => {
    const objAux = {};
    objAux.tipo = tipo;
    objAux.franjaDisponibilidad = franjaHoraria.toString();
    return objAux;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  function ResultadoOperacion(mensaje) {
    Swal.fire(mensaje);
    CargarLista();
    setReiniciarTexto(true);
  }

  return (
    <div id='contCrudJornadas' style={modoSeleccion && { zIndex: 10 }}>
      <CrudBasico
        entidad={"Jornadas"}
        propiedadTabla={listaAdaptada}
        esconderGeneral={true}
        onClickPositivo={AbrirRegistroJornada}
        clic={(e) => ManejarClickFila(e)}
        disabledDestructivo={listaVacia}
        listaSeleccionada={(lista) => setListaSelecciones(lista)}
        modoSeleccion={modoSeleccion}
        onClickDestructivo={OnClickDestructivo}
        agregar={(t) => setTextoAgregar(t)}
        reiniciarTextoAgregar={reiniciarTexto}
        vaciarChecks={vaciarChecks}
      />

      {
        abrirConsulta || abrirRegistro ? <ModalJornadas cerrarModal={() => CerrarModal()}
          abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro} objConsulta={jornadaConsultada} />
          : null
      }
      {
        abrirHorario ? <FranjaHoraria onClickDestructivo={CancelarRegistro}
          onClickPositivo={RegistrarJornada}
          franjaProp={(f) => setFranjaHoraria(f)} 
          horarioCompleto={horarioEntero}
          franjasOcupadasProp={[]}
          franjasDescartadasAux={[]}/>
          : null
      }
    </div>
  )
}

export default CrudJornadas