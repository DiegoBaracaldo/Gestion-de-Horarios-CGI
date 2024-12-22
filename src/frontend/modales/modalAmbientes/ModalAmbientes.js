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

    const CargarTorreInicial = () => {
        return new TorreServicio().CargarTorre(objConsulta.idTorre) || {};
    }

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);
    //Manejar modal de horario
    const [isOpenFranjaHoraria, setIsOpenFranjaHoraria] = useState(false);
    const [seleccTorre, setSeleccTorre] = useState(false);
    const [torre, setTorre] = useState(CargarTorreInicial());

    const [nombre, setNombre] = useState(objConsulta && objConsulta.nombre);
    const [capacidad, setCapacidad] = useState(objConsulta && objConsulta.capacidad);
    const [franjaDisponibilidad, setFranjaDisponibilidad] = useState(objConsulta && objConsulta.franjaDisponibilidad);
    const [ambiente, setAmbiente] = useState({});

    useEffect(() => {
        if(Object.keys(ambiente).length > 0){
            const ambienteServicio = new AmbienteServicio();
            ambienteServicio.GuardarAmbiente(ambiente);
            alert("Ambiente guardado correctamente!");
            onCloseProp && onCloseProp();
        }
    }, [ambiente]);

    const [torreNombre, setTorreNombre] = useState('Seleccionar torre...');

    useEffect(() => {
        Object.keys(torre).length > 0 && setTorreNombre(torre.nombre);
    }, [torre]);

    const RegistrarJornada = () => {
        if(franjaDisponibilidad.length > 0){
            setIsOpenFranjaHoraria(false);
        }else{
            alert("Debes establecer la disponibilidad horaria del aula de clase!");
        }
    }

    const ManejarCapacidad = (texto) => {
        if(texto.length > 3) setCapacidad(texto.substring(0, 3));
        else setCapacidad(texto);
    }

    const RegistrarAmbiente = () => {
        if(ValidarObjAmbiente()){
            FormarObjAmbiente();
        }
    }

    const FormarObjAmbiente = () => {
        const ambienteAux = new Ambiente(
            Math.floor(Math.random() * 900) + 100,
            FormatearNombre(nombre),
            torre.id,
            capacidad,
            franjaDisponibilidad,
            "2024-12-07T11:10:00",
            torre.nombre
        );
        setAmbiente(ambienteAux);
    }

    const ValidarObjAmbiente = () => {
        let bandera = false;
        const idTorre = torre.id;
        if(!CamposVacios(ambiente)){
            if(!nombre.toString().trim() || !HastaCien(nombre) || !AlfaNumericaConEspacio(nombre)){
                alert("Nombre Incorrecto");
                setNombre('');
            }else if(!idTorre || !idTorre.toString().trim() || !SoloNumeros(idTorre)){
                alert("Torre incorrecta!");
                setTorre({});
            }else if(!capacidad.toString().trim() || !HastaTres(capacidad) || !SoloNumeros(capacidad)){
                alert("Capacidad incorrecta");
                setCapacidad('');
            }else if(!franjaDisponibilidad.length > 0){
                alert("Debes establecer un rango horario de disponibilidad para el aula de clase!");
            }else{
                bandera = true;
            }
        }else{
            alert("Datos incorrectos!");
        }
        return bandera;
    }

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
        isOpenConsulta={abrirConsulta}
        bloquearInputs={(valor) => setInputsOff(valor)}
        edicionActivada={(valor) => setSeActivoEdicion(valor)}
        onClickPositivo={RegistrarAmbiente}>
            <div className='seccCajitasModal'>
                <section>
                    <label>nombre: </label>
                    <input maxLength={100} disabled={inputsOff} 
                    title='Nombre del aula' value={nombre}
                    onChange={(e) => setNombre(e.target.value)}/>
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
                    value={capacidad} onChange={(e) => ManejarCapacidad(e.target.value)}/>
                </section>
                <section>
                    <label>horario: </label>
                    {/* Si no es disponibilidad, es horario, si no es consulta, es resgistro,
                    y la edición activada es para cambiar el texto según se edita o se cancela */}
                    <BotonDispHoraria esDisponibilidad={true} esConsulta={abrirConsulta} 
                    edicionActivada={seActivoEdicion} onClicHorario={() => setIsOpenFranjaHoraria(true)}/>
                </section>
            </div>
            {
                isOpenFranjaHoraria ? 
                <FranjaHoraria onClickDestructivo={() => setIsOpenFranjaHoraria(false)}
                esConsulta={inputsOff} franjaProp={(f) => setFranjaDisponibilidad(f)}
                onClickPositivo={RegistrarJornada}
                franjasOcupadasProp={franjaDisponibilidad}/> 
                : null
            }
            {
                seleccTorre ? 
                <CrudTorres modoSeleccion={true} onClose={() => setSeleccTorre(false)}
                torreSeleccionada={(e) => setTorre(e)}/> 
                : null
            }
        </ModalGeneral>
    );
}
export default ModalAmbientes;