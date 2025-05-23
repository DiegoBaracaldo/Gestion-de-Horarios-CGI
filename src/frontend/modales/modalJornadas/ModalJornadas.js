import React, { useEffect, useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
import { CamposVacios, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaVeintiCinco } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
import Swal from 'sweetalert2';
function ModalJornadas({ abrirRegistro, abrirConsulta, cerrarModal, objConsulta
}) {
    const [inputsOff, setInputsOff] = useState(false);
    const [edicionActivada, setEdicionActivada] = useState(false);
    const [abrirHorario, setAbrirHorario] = useState(false);

    const tipoInicial = objConsulta.tipo || '';
    const [tipo, setTipo] = useState(tipoInicial);
    //Esta solo está en jornadas, para no cruzar horarios
    const [horarioEntero,  setHorarioEntero] = useState([]);
    const horarioInicialEstatico = objConsulta.franjaDisponibilidad &&
    objConsulta.franjaDisponibilidad.split(',').map(item => Number(item.trim())) || [];
    const [horarioInicial, setHorarioInicial] = useState(horarioInicialEstatico);
    const [horario, setHorario] = useState(horarioInicialEstatico);
    const [franjasDescartadasAux, setFranjasDescartadasAux]  = useState([]);
    const [jornada, setJornada] = useState({});
    const [primeraCarga, setPrimeraCarga] = useState(true);

    // useEffect(() => {
    //     console.log(horario);
    // }, [horario]);

    const idViejo = objConsulta.id || '';

    async function CargarHorarioCompleto(){
        try {
            const servicioJornada = new JornadaServicio();
            setHorarioEntero(await servicioJornada.CargarAllFranjas());
            //return servicioJornada.CargarAllFranjas();
        } catch (error) {
            Swal.fire(error);
            if(typeof cerrarModal ===  'function') cerrarModal();
        }
    }

    useEffect(() => {
        CargarHorarioCompleto();
    }, []);

    // useEffect(() => {
    //     console.log(horarioEntero);
    // }, [horarioEntero]);

    const Actualizarjornada = () => {
        setPrimeraCarga(false);
    }

    useEffect(() => {
        if (Object.keys(objConsulta).length > 0 && !primeraCarga) {
            Actualizar();
        }
    }, [jornada]);

    async function Actualizar() {
        try {
            const servicioJornada = new JornadaServicio();
            const respuesta = await servicioJornada.ActualizarJornada(idViejo, jornada);
            Swal.fire(respuesta !== 0 ? ("Jornada actualizada correctamente")
                : ("NO se actualizó la jornada!"));
        } catch (error) {
            Swal.fire(error);
        }
        cerrarModal && cerrarModal();
    }

    useEffect(() => {
        if (!primeraCarga) {
            if (ValidarobjJornada()) ObjJornadaActualizado();
        }
    }, [primeraCarga]);

    const ObjJornadaActualizado = () => {
        setJornada({
            ...objConsulta,
            tipo: FormatearNombre(tipo),
            franjaDisponibilidad: horario.toString()
        });
    }

    const ValidarobjJornada = () => {
        let bandera = false;
        if (!CamposVacios(jornada)) {
            if (!tipo || !tipo.toString().trim() || !HastaVeintiCinco(tipo) || !TextoConEspacio(tipo)) {
                Swal.fire("Tipo de jornada incorrecta, escribe bien!");
                setTipo('');
            } else if (!horario.length > 0) {
                Swal.fire("Debes establecer un horario para la jornada!");
            } else {
                bandera = true;
            }
        } else {
            Swal.fire("Datos incorrectos!");
        }
        return bandera;
    }

    const RegistrarHorarioJornada = () => {
        if (horario.length > 0){
            setHorarioInicial(horario);
            setAbrirHorario(false);
        } 
        else Swal.fire("Debes establecer un rango hroario para la jornada!");
    }

    function ReiniciarValores() {
        setTipo(tipoInicial);
        setHorarioInicial(horarioInicialEstatico);
        setHorario(horarioInicialEstatico);
    }

    // const AcomodarHorario = (listaFranjas) => {
    //     // const listaAux = listaFranjas.filter(numero => {
    //     //     if(!horarioEntero.includes(numero)) return numero;
    //     // });
    //     setHorario(listaFranjas);
    // }

    useEffect(() => {
        if (!edicionActivada) ReiniciarValores();
    }, [edicionActivada]);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} isOpenConsulta={abrirConsulta}
            onClose={cerrarModal} bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setEdicionActivada(valor)}
            onClickPositivo={Actualizarjornada}>
            <div className='seccCajitasModal'>
                <section>
                    <label>
                        Tipo:
                    </label>
                    <input maxLength={25} disabled={inputsOff} value={tipo}
                        onChange={(e) => setTipo(e.target.value)} />
                </section>
                <section>
                    <label>
                        Horario:
                    </label>
                    <BotonDispHoraria esDisponibilidad={false} esConsulta={abrirConsulta}
                        edicionActivada={edicionActivada} onClicHorario={() => setAbrirHorario(true)} 
                        horarioSeleccionado={horario.length > 0}/>
                </section>
            </div>
            {
                abrirHorario ? <FranjaHoraria onClickDestructivo={() => setAbrirHorario(false)}
                    esConsulta={inputsOff}
                    franjasOcupadasProp={horarioInicial}
                    esEdicion={edicionActivada}
                    onClickPositivo={RegistrarHorarioJornada}
                    franjaProp={(f) => setHorario(f)} 
                    horarioCompleto={horarioEntero}
                    setFranjasDescartadasAux={(f) => setFranjasDescartadasAux(f)}
                    franjasDescartadasAux={franjasDescartadasAux}/>
                    : null
            }
        </ModalGeneral>

    )
}

export default ModalJornadas