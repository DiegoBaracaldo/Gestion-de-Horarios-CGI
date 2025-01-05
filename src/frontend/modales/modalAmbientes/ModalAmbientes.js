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
import ObtenerErrorSQLite from '../../../baseDatos/ErroresSQLite';
import Swal from 'sweetalert2';

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
        if (abrirConsulta) CargarTorreInicial();
    }, []);

    const CargarTorreInicial = async () => {
        try {
            const respuesta = await new TorreServicio().CargarTorre(objConsulta.idTorre);
            if (typeof respuesta === 'object') {
                setTorre(respuesta);
            }
            else {
                Swal.fire("No se cargó la torre del ambiente en cuestión!");
                if (typeof onCloseProp === 'function') onCloseProp();
            }
        } catch (error) {
            Swal.fire(error);
            if (typeof onCloseProp === 'function') onCloseProp();
        }
    }

    const nombreInicial = objConsulta.nombre || '';
    const [nombre, setNombre] = useState(nombreInicial);
    const capacidadInicial = objConsulta.capacidad || '';
    const [capacidad, setCapacidad] = useState(capacidadInicial);
    const franjaInicialEstatica = objConsulta.franjaDisponibilidad &&
        objConsulta.franjaDisponibilidad.split(',').map(item => Number(item.trim())) || [];
    const [franjaInicial, setFranjaInicial] = useState(franjaInicialEstatica);
    const [franjaDisponibilidad, setFranjaDisponibilidad] = useState(franjaInicialEstatica);
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
        try {
            const ambienteServicio = new AmbienteServicio();
            const respuesta = seActivoEdicion ?
                await ambienteServicio.ActualizarAmbiente(idViejo, ambiente) :
                await ambienteServicio.GuardarAmbiente(ambiente);
            console.log(respuesta);
            Swal.fire(respuesta === 1 ? ("Se guardó correctamente el ambiente!")
                : ("NO se guardó el ambiente"));
        } catch (error) {
            //Este error viene desde el repositorio
            Swal.fire(error);
        }
        onCloseProp && onCloseProp();
    }

    const [torreNombre, setTorreNombre] = useState('Seleccionar torre...');

    useEffect(() => {
        Object.keys(torre).length > 0 && setTorreNombre(torre.nombre);
    }, [torre]);

    const RegistrarJornada = () => {
        if (franjaDisponibilidad.length > 0) {
            setFranjaInicial(franjaDisponibilidad);
            setIsOpenFranjaHoraria(false);
        } else {
            Swal.fire("Debes establecer la disponibilidad horaria del aula de clase!");
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
            Swal.fire("Nombre Incorrecto");
            setNombre('');
        } else if (!idTorre || !idTorre || !idTorre.toString().trim() || !SoloNumeros(idTorre)) {
            Swal.fire("Torre incorrecta!");
            setTorre({});
        } else if (!capacidad || !capacidad.toString().trim() || !HastaTres(capacidad) || !SoloNumeros(capacidad)) {
            Swal.fire("Capacidad incorrecta");
            setCapacidad('');
        } else if (!franjaDisponibilidad.length > 0) {
            Swal.fire("Debes establecer un rango horario de disponibilidad para el aula de clase!");
        } else {
            bandera = true;
        }
        return bandera;
    }

    function ReiniciarValores() {
        setNombre(nombreInicial);
        setTorre(torreInicial);
        setCapacidad(capacidadInicial);
        setFranjaInicial(franjaInicialEstatica);
        setFranjaDisponibilidad(franjaInicialEstatica);
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
                        edicionActivada={seActivoEdicion} onClicHorario={() => setIsOpenFranjaHoraria(true)}
                        horarioSeleccionado={franjaDisponibilidad.length > 0} />
                </section>
            </div>
            {
                isOpenFranjaHoraria ?
                    <FranjaHoraria onClickDestructivo={() => setIsOpenFranjaHoraria(false)}
                        esConsulta={inputsOff} franjaProp={(f) => setFranjaDisponibilidad(f)}
                        onClickPositivo={RegistrarJornada}
                        franjasOcupadasProp={franjaInicial}
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