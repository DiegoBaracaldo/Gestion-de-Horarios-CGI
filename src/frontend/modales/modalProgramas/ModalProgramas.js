import React, { useEffect, useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import { CamposVacios, EsFecha, SoloNumeros, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien, HastaCincuenta, HastaDos } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import Swal from 'sweetalert2';

function ModalProgramas({ abrirRegistro, abrirConsulta, cerrarModal, objConsulta }) {
  const [inputsOff, setInputsOff] = useState(false);

  /*****Se recogen los datos para el objeto que será registrado*****/
  const codigoInicial = objConsulta.id || '';
  const [codigo, setCodigo] = useState(codigoInicial);
  const nombreInicial = objConsulta.nombre || '';
  const [nombre, setNombre] = useState(nombreInicial);
  //el texto predeterminado debe coincidir con la opción predeterminada en el SELECT
  const tipoInicial = objConsulta.tipo || '';
  const [tipo, setTipo] = useState(tipoInicial);
  const cantidadTrimestresInicial = objConsulta.cantidadTrimestres || '';
  const [cantidadTrimestres, setCantidadTrimestres] = useState(cantidadTrimestresInicial);
  const fechaInicioInicial = objConsulta.fechaInicio || '';
  const [fechaInicio, setFechaInicio] = useState(fechaInicioInicial);
  const fechaFinInicial = objConsulta.fechaFin || '';
  const [fechaFin, setFechaFin] = useState(fechaFinInicial);
  const [programa, setPrograma] = useState({});


  const idViejo = objConsulta.id || '';

  function ManejarTopeHoras(texto) {
    if (texto.length > 2) setCantidadTrimestres(texto.substring(0, 2));
    else setCantidadTrimestres(texto);
  }

  //Si el objeto fue formado correctamente para el registro
  useEffect(() => {
    if (Object.keys(programa).length > 0) {
      Registrar();
    }
  }, [programa]);

  async function Registrar() {
    try {
      const servicioPrograma = new ProgramaServicio();
      const respuesta = abrirConsulta ? await servicioPrograma.ActualizarPrograma(idViejo, programa)
        : await servicioPrograma.GuardarPrograma(programa);
      Swal.fire(respuesta !== 0 ? 'Programa guardado correctamente!' : 'NO se guardó el programa!');
    } catch (error) {
      Swal.fire(error);
    }
    cerrarModal && cerrarModal();
  }

  const RegistrarPrograma = () => {
    //Se hace una validación exahustiva de los datos
    if (ValidarObjPrograma()) {
      if (abrirConsulta) ObjProgramaActualizado();
      else FormarObjPrograma();
    }
  }

  const FormarObjPrograma = () => {
    //ojo, hay que formatear los datos necesarios
    const objAux = {};
    objAux.id = Number(codigo);
    objAux.tipo = tipo;
    objAux.nombre = FormatearNombre(nombre);
    objAux.cantidadTrimestres = Number(cantidadTrimestres);
    objAux.fechaInicio = fechaInicio;
    objAux.fechaFin = fechaFin;
    setPrograma(objAux);
  }

  const ObjProgramaActualizado = () => {
    setPrograma({
      ...programa,
      id: Number(codigo),
      nombre: FormatearNombre(nombre),
      tipo: tipo,
      cantidadTrimestres: Number(cantidadTrimestres),
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    });
  }

  const ValidarObjPrograma = () => {
    let bandera = false;
    if (!codigo || !codigo.toString().trim() || !HastaCincuenta(codigo.toString()) || !SoloNumeros(codigo)) {
      Swal.fire("Código incorrecto");
      setCodigo('');
    } else if (!nombre || !nombre.toString().trim() || !HastaCien(nombre.toString()) || !TextoConEspacio(nombre)) {
      Swal.fire("Nombre incorrecto!");
      setNombre('');
    } else if (!tipo || !tipo.toString().trim() || !HastaCincuenta(tipo.toString()) || !TextoConEspacio(tipo)) {
      Swal.fire("Tipo incorrecto");
      setTipo('tecnico');
    } else if (!cantidadTrimestres || !cantidadTrimestres.toString().trim() || !HastaDos(cantidadTrimestres.toString()) || !SoloNumeros(cantidadTrimestres)) {
      Swal.fire("Cantidad de trimestres incorrecta");
      setCantidadTrimestres('');
    } else if (!fechaInicio || !fechaInicio.toString().trim() || EsFecha(fechaInicio)) {
      Swal.fire("Fecha de inicio incorrecta!");
      setFechaInicio('');
    } else if (!fechaFin || !fechaFin.toString().trim() || EsFecha(fechaFin)) {
      Swal.fire("Fecha de fin incorrecta!");
      setFechaFin('');
    } else if (fechaFin < fechaInicio) {
      Swal.fire("Fecha final debería ser mayor que fecha inicial!");
    } else {
      bandera = true;
    }
    return bandera;
  }

  const ReiniciarValores = () => {
    setCodigo(codigoInicial);
    setNombre(nombreInicial);
    setTipo(tipoInicial);
    setCantidadTrimestres(cantidadTrimestresInicial);
    setFechaInicio(fechaInicioInicial);
    setFechaFin(fechaFinInicial);
  }

  return (
    <div>
      <ModalGeneral isOpenRegistro={abrirRegistro} isOpenConsulta={abrirConsulta}
        onClose={cerrarModal}
        bloquearInputs={(valor) => setInputsOff(valor)}
        onClickPositivo={RegistrarPrograma}
        edicionActivada={(e) => !e ? ReiniciarValores() : null}
      >

        <div className='seccCajitasModal'>
          <section>
            <label>
              Código:
            </label>
            <input disabled={inputsOff} type='number' value={codigo}
              onChange={(e) => setCodigo(e.target.value)} />
          </section>
          <section>
            <label>
              Nombre:
            </label>
            <input disabled={inputsOff} maxLength={100} value={nombre}
              onChange={(e) => setNombre(e.target.value)} />
          </section>
          <section>
            <label>
              Tipo:
            </label>
            <select disabled={inputsOff} onChange={(e) => setTipo(e.target.value)} value={tipo}>
              <option value={"cursoCorto"}>
                Curso corto
              </option>
              <option value={"tecnico"} selected>
                Técnico
              </option>
              <option value={"tecnologo"}>
                Tecnólogo
              </option>
            </select>
          </section>

          <section>
            <label>
              Cantidad de trimestres:
            </label>
            <input disabled={inputsOff} type='number' value={cantidadTrimestres}
              onChange={(e) => ManejarTopeHoras(e.target.value)} />
          </section>

          <section>
            <label>
              Fecha de inicio:
            </label>
            <input type='date' disabled={inputsOff}
              onChange={(e) => setFechaInicio(e.target.value)}
              value={fechaInicio} />
          </section>

          <section>
            <label>
              Fecha final:
            </label>
            <input type='date' disabled={inputsOff} value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)} />
          </section>

        </div>

      </ModalGeneral>

    </div>
  )
}

export default ModalProgramas