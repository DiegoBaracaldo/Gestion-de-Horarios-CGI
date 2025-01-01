import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
import CrudTorres from '../../paginas/crudTorres/CrudTorres';
import { AlfaNumericaConEspacio, CamposVacios, SoloNumeros, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien, HastaDos, HastaTres } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import Ambiente from '../../../backend/repository/entidades/Ambiente';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import TorreServicio from '../../../backend/repository/servicios/TorreService';

const ModalAmbientes = ({ abrirConsulta, abrirRegistro, onCloseProp, objConsulta }) => {



    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);
    //Manejar modal de horario
    const [isOpenFranjaHoraria, setIsOpenFranjaHoraria] = useState(false);
    const [seleccTorre, setSeleccTorre] = useState(false);
    let torreInicial = {};
    const [torre, setTorre] = useState(torreInicial);

    useEffect(() => {
        if(abrirConsulta) CargarTorreInicial();
    }, []);

    const CargarTorreInicial = async () => {
        try {
            torreInicial = await new TorreServicio().CargarTorre(objConsulta.idTorre);
            setTorre(torreInicial);
        } catch (error) {
            console.log("Error al obtener torre del ambiente por: ", error);
        }
    }

    const nombreInicial = objConsulta.nombre || '';
    const [nombre, setNombre] = useState(nombreInicial);
    const capacidadInicial = objConsulta.capacidad || '';
    const [capacidad, setCapacidad] = useState(capacidadInicial);
    const franjaInicial = objConsulta.franjaDisponibilidad &&
        objConsulta.franjaDisponibilidad.split(',').map(item => Number(item.trim())) || [];
    const [franjaDisponibilidad, setFranjaDisponibilidad] = useState(franjaInicial);
    const [ambiente, setAmbiente] = useState({});

    //Es el id del objeto que se carga al iniciar el modal en modo consulta para pode editarlo
    //aún si se edita su id.
    const idViejo = objConsulta.id || '';

    useEffect(() => {
        if (Object.keys(ambiente).length > 0) {
            Registrar();
        }
    }, [ambiente]);

    async function Registrar() {
        const ambienteServicio = new AmbienteServicio();
        const respuesta = seActivoEdicion ?
            await ambienteServicio.ActualizarAmbiente(idViejo, ambiente) :
            await ambienteServicio.GuardarAmbiente(ambiente);
        alert(respuesta !== 0 ? ("Operación EXITOSA!") : ("Operación FALLIDA!"));
        onCloseProp && onCloseProp();
    }

    const [torreNombre, setTorreNombre] = useState('Seleccionar torre...');

    useEffect(() => {
        Object.keys(torre).length > 0 && setTorreNombre(torre.nombre);
    }, [torre]);

    const RegistrarJornada = () => {
        if (franjaDisponibilidad.length > 0) {
            setIsOpenFranjaHoraria(false);
        } else {
            alert("Debes establecer la disponibilidad horaria del aula de clase!");
        }
    }

    const ManejarCapacidad = (texto) => {
        if (texto.length > 3) setCapacidad(texto.substring(0, 3));
        else setCapacidad(texto);
    }

    const RegistrarAmbiente = () => {
        if (ValidarObjAmbiente()) {
            if (abrirConsulta) ObjAmbienteActualizado();
            else FormarObjAmbiente();

        }
    }

    const FormarObjAmbiente = () => {
        const ambienteAux = {
            nombre: FormatearNombre(nombre),
            idTorre: torre.id,
            capacidad: Number(capacidad),
            franjaDisponibilidad: franjaDisponibilidad.toString()
        };
        setAmbiente(ambienteAux);
    }

    const ObjAmbienteActualizado = () => {
        setAmbiente({
            ...objConsulta,
            nombre: FormatearNombre(nombre),
            idTorre: torre.id,
            capacidad: Number(capacidad),
            franjaDisponibilidad: franjaDisponibilidad.toString()
        });
    }

    const ValidarObjAmbiente = () => {
        let bandera = false;
        const idTorre = torre.id;
        if (!nombre || !nombre.toString().trim() || !HastaCien(nombre) || !AlfaNumericaConEspacio(nombre)) {
            alert("Nombre Incorrecto");
            setNombre('');
        } else if (!idTorre || !idTorre || !idTorre.toString().trim() || !SoloNumeros(idTorre)) {
            alert("Torre incorrecta!");
            setTorre({});
        } else if (!capacidad || !capacidad.toString().trim() || !HastaTres(capacidad) || !SoloNumeros(capacidad)) {
            alert("Capacidad incorrecta");
            setCapacidad('');
        } else if (!franjaDisponibilidad.length > 0) {
            alert("Debes establecer un rango horario de disponibilidad para el aula de clase!");
        } else {
            bandera = true;
        }
        return bandera;
    }

    function ReiniciarValores() {
        setNombre(nombreInicial);
        setTorre(torreInicial);
        setCapacidad(capacidadInicial);
        setFranjaDisponibilidad(franjaInicial);
    }

    useEffect(() => {
        if (!seActivoEdicion) ReiniciarValores();
    }, [seActivoEdicion]);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}
            onClickPositivo={RegistrarAmbiente}>
            <div className='seccCajitasModal'>
                <section>
                    <label>nombre: </label>
                    <input maxLength={100} disabled={inputsOff}
                        title='Nombre del aula' value={nombre}
                        onChange={(e) => setNombre(e.target.value)} />
                </section>
                <section>
                    <label>torre: </label>
                    <button disabled={inputsOff} onClick={() => setSeleccTorre(true)}
                    >{torreNombre}</button>
                </section>
                <section>
                    <label>capacidad: </label>
                    <input type='number' disabled={inputsOff}
                        title='capacidad máxima de estudiantes posibles (2 dígitos)'
                        value={capacidad} onChange={(e) => ManejarCapacidad(e.target.value)} />
                </section>
                <section>
                    <label>horario: </label>
                    {/* Si no es disponibilidad, es horario, si no es consulta, es resgistro,
                    y la edición activada es para cambiar el texto según se edita o se cancela */}
                    <BotonDispHoraria esDisponibilidad={true} esConsulta={abrirConsulta}
                        edicionActivada={seActivoEdicion} onClicHorario={() => setIsOpenFranjaHoraria(true)} />
                </section>
            </div>
            {
                isOpenFranjaHoraria ?
                    <FranjaHoraria onClickDestructivo={() => setIsOpenFranjaHoraria(false)}
                        esConsulta={inputsOff} franjaProp={(f) => setFranjaDisponibilidad(f)}
                        onClickPositivo={RegistrarJornada}
                        franjasOcupadasProp={franjaDisponibilidad}
                        esEdicion={seActivoEdicion} />
                    : null
            }
            {
                seleccTorre ?
                    <CrudTorres modoSeleccion={true} onClose={() => setSeleccTorre(false)}
                        torreSeleccionada={(e) => setTorre(e)} />
                    : null
            }
        </ModalGeneral>
    );
}
export default ModalAmbientes;