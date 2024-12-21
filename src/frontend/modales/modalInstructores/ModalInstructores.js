import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral'
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
import { ocupanciaUno } from '../../mocks/MockFranjaHoraria';
import { CamposVacios, EsCorreo, EsTelefono, SoloNumeros, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaCien, HastaCincuenta, HastaDos } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';

const ModalInstructores = ({ abrirConsulta, abrirRegistro, onCloseProp }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);

    /*****Se recogen los datos para el objeto que será registrado*****/
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [topeHoras, setTopeHoras] = useState('');
    const [franjaDisponibilidad, setFranjaDisponibilidad] = useState([]);
    const [instructor, setInstructor] = useState({});

    useEffect(() => {
        if(Object.keys(instructor).length > 0){
            const servicioInstructor = new InstructorServicio();
            servicioInstructor.GuardarInstructor(instructor);
            alert("Instructor  registrado correctamente!");
            onCloseProp && onCloseProp();
        }
    }, [instructor]);

    function ManejarTopeHoras(texto) {
        if (texto.length > 2) setTopeHoras(texto.substring(0, 2));
        else setTopeHoras(texto);
    }

    const RegistrarInstructor = () => {
        //Se hace una validación exahustiva de los datos
        if (ValidarObjInstructor()) {
            FormarObjInstructor();
        }
    }

    const RegistrarJornada = () => {
        if(franjaDisponibilidad.length > 0){
            setIsOpenFranjaHoraria(false);
        }else{
            alert("Debes establecer la disponibilidad horaria del instructor!");
        }
    }

    const ValidarObjInstructor = () => {
        let bandera = false;
        if (!CamposVacios(instructor)) {
            if (!cedula.toString().trim() || !HastaCincuenta(cedula) || !SoloNumeros(cedula)) {
                alert("Cédula incorrecta!");
                setCedula('');
            } else if (!nombre.toString().trim() || !HastaCien(nombre) || !TextoConEspacio(nombre)) {
                alert("Nombre incorrecto!");
                setNombre('');
            } else if (!correo.toString().trim() || !HastaCien(correo) || !EsCorreo(correo)) {
                alert("Correo electrónico incorrecto");
                setCorreo('');
            } else if (!telefono.toString().trim() || !HastaCien(telefono) || !EsTelefono(telefono)) {
                alert("Teléfono incorrecto");
                setTelefono('');
            } else if (!especialidad.toString().trim() || !HastaCien(especialidad) || !TextoConEspacio(especialidad)) {
                alert("Especialidad incorrecta");
                setEspecialidad('');
            } else if (!topeHoras.toString().trim() || !HastaDos(topeHoras) || !SoloNumeros(topeHoras)) {
                alert("Tope de horas semanales incorrecto");
                setTopeHoras('');
            }else if(!franjaDisponibilidad.length > 0){
                alert("Debes establecer una disponibilidad horaria para el instructor!");
            }else {
                bandera = true;
            }
        } else {
            alert("Datos incorrectos!");
        }
        return bandera;
    }

    const FormarObjInstructor = () => {
        const objAux = {};
        objAux.id = cedula;
        objAux.nombre = FormatearNombre(nombre);
        objAux.topeHoras = topeHoras;
        objAux.correo = correo;
        objAux.telefono = telefono;
        objAux.especialidad = FormatearNombre(especialidad);
        objAux.disponible = true;
        objAux.esResponsable = false;
        objAux.franjaDisponibilidad = franjaDisponibilidad;
        objAux.fechaRegistro = '2024-12-07T13:05:00';
        setInstructor(objAux);
    }

    //Manejar modal de horario
    const [isOpenFranjaHoraria, setIsOpenFranjaHoraria] = useState(false);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
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
                        onClickPositivo={RegistrarJornada}/>
            }
        </ModalGeneral>
    );
}
export default ModalInstructores;