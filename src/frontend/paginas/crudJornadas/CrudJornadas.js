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

function CrudJornadas({ modoSeleccion, onClose, jornadaSeleccionada }) {
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
  const [textoAgregar, setTextoAgregar] = useState('');
  const [franjaHoraria, setFranjaHoraria] = useState([]);

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
      jornadaSeleccionada && jornadaSeleccionada(e);
      onClose();
    } else {
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
        alert("Dato incorrecto");
      }
    } else {
      alert("Valor inválido");
    }
  }

  function RegistrarJornada() {
    setAbrirHorario(false);
    const objFormado = FormarObjetoTorre(FormatearNombre(textoAgregar));
    console.log(objFormado.franjaDisponibilidad);
    const servicioJornada = new JornadaServicio();
    servicioJornada.GuardarJornada(objFormado);
    setListaFiltrada([...CargarLista()]);
    setReiniciarTexto(true);
  }

  const CancelarRegistro = () => {
    setAbrirHorario(false);
    setFranjaHoraria([]);
    setReiniciarTexto(true);
  }

  useEffect(() => {
    reiniciarTexto && setReiniciarTexto(false);
  }, [reiniciarTexto]);

  const FormarObjetoTorre = (tipo) => {
    const objAux = {};
    let numeroRandom = Math.floor(Math.random() * 900) + 100;
    objAux.id = numeroRandom;
    objAux.tipo = tipo;
    objAux.franjaDisponibilidad = franjaHoraria;
    objAux.fechaRegistro = "2024-12-07T11:10:00";
    return objAux;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////


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
      />

      {
        abrirConsulta || abrirRegistro ? <ModalJornadas cerrarModal={() => CerrarModal()}
          abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro} />
          : null
      }
      {
        abrirHorario ? <FranjaHoraria onClickDestructivo={CancelarRegistro}
        onClickPositivo={RegistrarJornada}
          franjaProp={(f) => setFranjaHoraria(f)} />
          : null
      }
    </div>
  )
}

export default CrudJornadas