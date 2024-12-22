import React, { useEffect, useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import { CamposVacios, EsFecha, SoloNumeros, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien, HastaCincuenta, HastaDos } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';

function ModalProgramas({ abrirRegistro, abrirConsulta, cerrarModal, objConsulta}) {
  const [inputsOff, setInputsOff] = useState(false);

  /*****Se recogen los datos para el objeto que será registrado*****/
  const [codigo, setCodigo] = useState(objConsulta && objConsulta.id);
  const [nombre, setNombre] = useState(objConsulta && objConsulta.nombre);
  //el texto predeterminado debe coincidir con la opción predeterminada en el SELECT
  const [tipo, setTipo] = useState(objConsulta && objConsulta.tipo);
  const [cantidadTrimestres, setCantidadTrimestres] = useState(objConsulta && objConsulta.cantidadTrimestres);
  const [fechaInicio, setFechaInicio] = useState(objConsulta && objConsulta.fechaInicio);
  const [fechaFin, setFechaFin] = useState(objConsulta && objConsulta.fechaFin);
  const [programa, setPrograma] = useState({});

  function ManejarTopeHoras(texto) {
    if (texto.length > 2) setCantidadTrimestres(texto.substring(0, 2));
    else setCantidadTrimestres(texto);
}

  //Si el objeto fue formado correctamente para el registro
  useEffect(() => {
    if(Object.keys(programa).length > 0){
      const servicioPrograma = new ProgramaServicio();
      servicioPrograma.GuardarPrograma(programa);
      alert("Programa registrado correctamente!");
      cerrarModal && cerrarModal();
    }
  }, [programa]);


  const RegistrarPrograma = () => {
    //Se hace una validación exahustiva de los datos
    if(ValidarObjPrograma()){
      FormarObjPrograma();
    }
  }

  const FormarObjPrograma = () => {
    //ojo, hay que formatear los datos necesarios
    const objAux = {};
    objAux.id = codigo;
    objAux.tipo = tipo;
    objAux.nombre = FormatearNombre(nombre);
    objAux.cantidadTrimestres = cantidadTrimestres;
    objAux.fechaInicio = fechaInicio;
    objAux.fechaFin = fechaFin;
    objAux.fechaRegistro = "2024-12-07T11:10:00";
    setPrograma(objAux);
  }

  const ValidarObjPrograma = () => {
    let bandera = false;
      if (!codigo || !codigo.toString().trim() || !HastaCincuenta(codigo.toString()) || !SoloNumeros(codigo)) {
        alert("Código incorrecto");
        setCodigo('');
      } else if (!nombre || !nombre.toString().trim() || !HastaCien(nombre.toString()) || !TextoConEspacio(nombre)) {
        alert("Nombre incorrecto!");
        setNombre('');
      } else if (!tipo || !tipo.toString().trim() || !HastaCincuenta(tipo.toString()) || !TextoConEspacio(tipo)) {
        alert("Tipo incorrecto");
        setTipo('tecnico');
      } else if (!cantidadTrimestres || !cantidadTrimestres.toString().trim() || !HastaDos(cantidadTrimestres.toString()) || !SoloNumeros(cantidadTrimestres)) {
        alert("Cantidad de trimestres incorrecta");
        setCantidadTrimestres('');
      } else if (!fechaInicio || !fechaInicio.toString().trim() || EsFecha(fechaInicio)) {
        alert("Fecha de inicio incorrecta!");
        setFechaInicio('');
      } else if (!fechaFin || !fechaFin.toString().trim() || EsFecha(fechaFin)) {
        alert("Fecha de fin incorrecta!");
        setFechaFin('');
      } else if (fechaFin < fechaInicio) {
        alert("Fecha final debería ser mayor que fecha inicial!");
      } else {
        bandera = true;
      }
    return bandera;
  }

  return (
    <div>
      <ModalGeneral isOpenRegistro={abrirRegistro} isOpenConsulta={abrirConsulta}
        onClose={cerrarModal && (() => cerrarModal())}
        bloquearInputs={(valor) => setInputsOff(valor)}
        onClickPositivo={RegistrarPrograma}
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