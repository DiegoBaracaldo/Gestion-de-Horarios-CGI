import React, { useEffect, useState } from 'react'
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria'
import FranjaHoraria from '../../componentes/franjaHoraria/FranjaHoraria';
import { CamposVacios, TextoConEspacio } from '../../../backend/validacion/ValidacionFormato';
import { HastaVeintiCinco } from '../../../backend/validacion/ValidacionCantidadCaracteres';
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import { FormatearNombre } from '../../../backend/formato/FormatoDatos';
function ModalJornadas({ abrirRegistro, abrirConsulta, cerrarModal, objConsulta
}) {
    const [inputsOff, setInputsOff] = useState(false);
    const [edicionActivada, setEdicionActivada] = useState(false);
    const [abrirHorario, setAbrirHorario] = useState(false);

    const tipoInicial = objConsulta.tipo || '';
    const [tipo, setTipo] = useState(tipoInicial);
    const horarioInicial =
        objConsulta.franjaDisponibilidad &&
        objConsulta.franjaDisponibilidad.split(',').map(item => Number(item.trim())) || [];
    const [horario, setHorario] = useState(horarioInicial);
    const [jornada, setJornada] = useState({});
    const [primeraCarga, setPrimeraCarga] = useState(true);

    const idViejo = objConsulta.id || '';

    const Actualizarjornada = () => {
        setPrimeraCarga(false);
    }

    useEffect(() => {
        if (Object.keys(objConsulta).length > 0 && !primeraCarga) {
            Actualizar();
        }
    }, [jornada]);

    async function Actualizar() {
        const servicioJornada = new JornadaServicio();
        const respuesta = await servicioJornada.ActualizarJornada(idViejo, jornada);
        alert(respuesta !== 0 ? ("Jornada actualizada correctamente")
            : ("Jornada actualizada correctamente"));
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
                alert("Tipo de jornada incorrecta, escribe bien!");
                setTipo('');
            } else if (!horario.length > 0) {
                alert("Debes establecer un horario para la jornada!");
            } else {
                bandera = true;
            }
        } else {
            alert("Datos incorrectos!");
        }
        return bandera;
    }

    const RegistrarHorarioJornada = () => {
        if (horario.length > 0) setAbrirHorario(false);
        else alert("Debes establecer un rango hroario para la jornada!");
    }

    function ReiniciarValores() {
        setTipo(tipoInicial);
        setHorario(horarioInicial);
    }

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
                        edicionActivada={edicionActivada} onClicHorario={() => setAbrirHorario(true)} />
                </section>
            </div>
            {
                abrirHorario ? <FranjaHoraria onClickDestructivo={() => setAbrirHorario(false)}
                    esConsulta={inputsOff}
                    franjasOcupadasProp={horario}
                    esEdicion={edicionActivada}
                    onClickPositivo={RegistrarHorarioJornada}
                    franjaProp={(f) => setHorario(f)} />
                    : null
            }
        </ModalGeneral>

    )
}

export default ModalJornadas