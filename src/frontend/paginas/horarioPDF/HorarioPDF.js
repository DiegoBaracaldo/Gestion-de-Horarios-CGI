import { useNavigate } from 'react-router-dom';
import BotonDestructivo from '../../componentes/botonDestructivo/BotonDestructivo';
import BotonPositivo from '../../componentes/botonPositivo/BotonPositivo';
import MarcoGralHorario from '../../componentes/marcoGeneralHorario/MarcoGralHorario';
import './HorarioPDF.css';
import { useEffect, useRef, useState } from 'react';
import HorarioPDFServicio from '../../../backend/repository/servicios/HorarioPDFServicie';
import Swal from 'sweetalert2';
import FranjaServicio from '../../../backend/repository/servicios/FranjaService';

const HorarioPDF = () => {

    const navegar = useNavigate(-1);

    const horarioHaCambiado = useRef(DetectarHorarioAlterado());
    const franjasInstructores = useRef(new Map());
    const franjasGrupos = useRef(new Map());
    const horarioInstructores = useRef(new Map());
    const horarioGrupos = useRef(new Map());
    const [arrayHorariosGrupos, setArrayHorariosGrupos] = useState([]);
    const [arrayHorariosInstructores, setArrayHorariosInstructores] = useState([]);

    useEffect(() => {

    }, []);

    const GenerarPDFS = () => {
        GetFranjas();
    }

    async function GetFranjas() {
        try {
            const respuesta = await new FranjaServicio().CargarFranjas();
            // console.log(respuesta);
            //Recojo las franjas de cada instructor y grupo de una vez
            respuesta.forEach(franja => {
                if (franja) {
                    const arrayFranjasInstructor = franjasInstructores.current.get(franja.idInstructor);
                    if (!arrayFranjasInstructor) {
                        franjasInstructores.current.set(franja.idInstructor, []);
                    }
                    arrayFranjasInstructor?.push(franja);

                    const arrayFranjasGrupo = franjasGrupos.current.get(franja.idGrupo);
                    if (!arrayFranjasGrupo) {
                        franjasGrupos.current.set(franja.idGrupo, []);
                    }
                    arrayFranjasGrupo?.push(franja);
                }
            });
            console.log(franjasInstructores.current);
            console.log(franjasGrupos.current);
        } catch (error) {
            console.log(error);
            Swal.fire(error)
        }
    }

    async function DetectarHorarioAlterado() {
        //lógica para detectar si horario ha cambiado desde la última generación de PDF
        try {
            const respuesta = await new HorarioPDFServicio().EncontrarValor('horarioCambiado');
            // console.log(respuesta);
            if (respuesta === 'true') return true;
            else return false;
        } catch (error) {
            Swal.fire(error);
        }
    }

    return (
        <div id='contHorarioPDF'>
            <MarcoGralHorario
                titulo={'horario pdf'}>
                <div className='contInternoHorarioPDF'>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`generar pdf's`} disabledProp={!horarioHaCambiado.current}
                            onClick={GenerarPDFS} />
                    </div>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`descargar pdf's instructores`} disabledProp={horarioHaCambiado.current} />
                    </div>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`descargar pdf's grupos`} disabledProp={horarioHaCambiado.current} />
                    </div>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`enviar pdf's automáticamente `} disabledProp={horarioHaCambiado.current} />
                    </div>
                </div>
            </MarcoGralHorario>
            <div className='contBotones'>
                <BotonDestructivo
                    texto={`atrás`}
                    onClick={() => navegar(-1)} />
            </div>
        </div>
    );
}
export default HorarioPDF;