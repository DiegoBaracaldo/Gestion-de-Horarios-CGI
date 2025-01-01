import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral'
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
import { ocupanciaUno } from '../../mocks/MockFranjaHoraria';
import { CamposVacios, EsCorreo, EsTelefono, SoloNumeros, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien, HastaCincuenta, HastaDos } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';

const ModalInstructores = ({ abrirConsulta, abrirRegistro, onCloseProp, objConsultado }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    /*****Se recogen los datos para el objeto que será registrado*****/
    const cedulaInicial = objConsultado.id || '';
    const [cedula, setCedula] = useState(cedulaInicial);
    const nombreInicial = objConsultado.nombre || '';
    const [nombre, setNombre] = useState(nombreInicial);
    const correoInicial = objConsultado.correo || '';
    const [correo, setCorreo] = useState(correoInicial);
    const telefonoInicial = objConsultado.telefono || '';
    const [telefono, setTelefono] = useState(telefonoInicial);
    const especialidadInicial = objConsultado.especialidad || '';
    const [especialidad, setEspecialidad] = useState(especialidadInicial);
    const topeHorasInicial = objConsultado.topeHoras || '';
    const [topeHoras, setTopeHoras] = useState(topeHorasInicial);
    const franjaInicial = objConsultado.franjaDisponibilidad &&
        objConsultado.franjaDisponibilidad .split(',').map(item => Number(item.trim())) || [];
    const [franjaDisponibilidad, setFranjaDisponibilidad] = useState(franjaInicial);
    const [instructor, setInstructor] = useState({});

    useEffect(() => {
        if (Object.keys(instructor).length > 0) {
            Registrar();
        }
    }, [instructor]);

    async function Registrar() {
        const servicioInstructor = new InstructorServicio();
        const respuesta = abrirConsulta ? await servicioInstructor.ActualizarInstructor(cedulaInicial, instructor)
            : await servicioInstructor.GuardarInstructor(instructor);
        alert(respuesta !== 0 ? 'Operación EXITOSA!' : 'Operación FALLIDA!');
        onCloseProp && onCloseProp();
    }

    function ManejarTopeHoras(texto) {
        if (texto.length > 2) setTopeHoras(texto.substring(0, 2));
        else setTopeHoras(texto);
    }

    const RegistrarInstructor = () => {
        //Se hace una validación exahustiva de los datos
        if (ValidarObjInstructor()) {
            if (abrirConsulta) ObjInstructorActualizado();
            else FormarObjInstructor();
        }
    }

    const RegistrarJornada = () => {
        if (franjaDisponibilidad.length > 0) {
            setIsOpenFranjaHoraria(false);
        } else {
            alert("Debes establecer la disponibilidad horaria del instructor!");
        }
    }

    const ValidarObjInstructor = () => {
        let bandera = false;
        if (!cedula || !cedula.toString().trim() || !HastaCincuenta(cedula) || !SoloNumeros(cedula)) {
            alert("Cédula incorrecta!");
            setCedula('');
        } else if (!nombre || !nombre.toString().trim() || !HastaCien(nombre) || !TextoConEspacio(nombre)) {
            alert("Nombre incorrecto!");
            setNombre('');
        } else if (!correo || !correo.toString().trim() || !HastaCien(correo) || !EsCorreo(correo)) {
            alert("Correo electrónico incorrecto");
            setCorreo('');
        } else if (!telefono || !telefono.toString().trim() || !HastaCien(telefono) || !EsTelefono(telefono)) {
            alert("Teléfono incorrecto");
            setTelefono('');
        } else if (!especialidad || !especialidad.toString().trim() || !HastaCien(especialidad) || !TextoConEspacio(especialidad)) {
            alert("Especialidad incorrecta");
            setEspecialidad('');
        } else if (!topeHoras || !topeHoras.toString().trim() || !HastaDos(topeHoras) || !SoloNumeros(topeHoras)) {
            alert("Tope de horas semanales incorrecto");
            setTopeHoras('');
        } else if (!franjaDisponibilidad.length > 0) {
            alert("Debes establecer una disponibilidad horaria para el instructor!");
        } else {
            bandera = true;
        }
        return bandera;
    }

    const FormarObjInstructor = () => {
        const objAux = {};
        objAux.id = Number(cedula);
        objAux.nombre = FormatearNombre(nombre);
        objAux.topeHoras = Number(topeHoras);
        objAux.correo = correo;
        objAux.telefono = telefono;
        objAux.especialidad = FormatearNombre(especialidad);
        objAux.franjaDisponibilidad = franjaDisponibilidad.toString();
        setInstructor(objAux);
    }

    const ObjInstructorActualizado = () => {
        setInstructor({
            ...objConsultado,
            id: Number(cedula),
            nombre:FormatearNombre(nombre),
            correo: correo,
            telefono: telefono,
            especialidad: especialidad,
            topeHoras: Number(topeHoras),
            franjaDisponibilidad: franjaDisponibilidad.toString()
        });
    }

    //Manejar modal de horario
    const [isOpenFranjaHoraria, setIsOpenFranjaHoraria] = useState(false);

    function ReiniciarValores() {
        setCedula(cedulaInicial);
        setNombre(nombreInicial);
        setCorreo(correoInicial);
        setTelefono(telefonoInicial);
        setEspecialidad(especialidadInicial);
        setTopeHoras(topeHorasInicial);
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
            onClickPositivo={RegistrarInstructor}>
            <div className='seccCajitasModal'>
                <section>
                    <label>cédula: </label>
                    <input type='number' disabled={inputsOff}
                        title='Sólo números, sin signos especiales' value={cedula}
                        onChange={(e) => setCedula(e.target.value)} />
                </section>
                <section>
                    <label>nombre: </label>
                    <input maxLength={100} disabled={inputsOff}
                        title='Nombre completo' value={nombre}
                        onChange={(e) => setNombre(e.target.value)} />
                </section>
                <section>
                    <label>correo: </label>
                    <input maxLength={100} disabled={inputsOff} value={correo}
                        onChange={(e) => setCorreo(e.target.value)} />
                </section>
                <section>
                    <label>teléfono: </label>
                    <input maxLength={100} disabled={inputsOff} value={telefono}
                        onChange={(e) => setTelefono(e.target.value)} />
                </section>
                <section>
                    <label>especialidad: </label>
                    <input maxLength={100} disabled={inputsOff} value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)} />
                </section>
                <section>
                    <label>tope de horas: </label>
                    <input type='number' disabled={inputsOff}
                        title='tope de horas semanales' value={topeHoras}
                        onChange={(e) => ManejarTopeHoras(e.target.value)} />
                </section>
                <section>
                    <label>horario: </label>
                    {/* Si no es disponibilidad, es horario, si no es consulta, es resgistro,
                    y la edición activada es para cambiar el texto según se edita o se cancela */}
                    <BotonDispHoraria esDisponibilidad={true} esConsulta={abrirConsulta}
                        edicionActivada={seActivoEdicion}
                        onClicHorario={() => setIsOpenFranjaHoraria(true)} />
                </section>
            </div>
            {
                !isOpenFranjaHoraria ? null :
                    <FranjaHoraria isOpen={isOpenFranjaHoraria}
                        onClickDestructivo={() => setIsOpenFranjaHoraria(false)}
                        esConsulta={inputsOff} franjaProp={(f) => setFranjaDisponibilidad(f)}
                        onClickPositivo={RegistrarJornada}
                        franjasOcupadasProp={franjaDisponibilidad}
                        esEdicion={seActivoEdicion} />
            }
        </ModalGeneral>
    );
}
export default ModalInstructores;