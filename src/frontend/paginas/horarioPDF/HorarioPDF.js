import { useNavigate } from 'react-router-dom';
import BotonDestructivo from '../../componentes/botonDestructivo/BotonDestructivo';
import BotonPositivo from '../../componentes/botonPositivo/BotonPositivo';
import MarcoGralHorario from '../../componentes/marcoGeneralHorario/MarcoGralHorario';
import './HorarioPDF.css';
import { useEffect, useRef, useState } from 'react';
import HorarioPDFServicio from '../../../backend/repository/servicios/HorarioPDFServicie';
import Swal from 'sweetalert2';
import CrearHorarioInstructores from './HorarioInstructores';
import jsPDF from 'jspdf';
import { renderToString } from 'react-dom/server';


const HorarioPDF = () => {

    const navegar = useNavigate(-1);
    const horarioHaCambiado = useRef(DetectarHorarioAlterado());

    useEffect(() => {

    }, []);

    const GenerarPDFS = async () => {
        //console.log(await GenerarPDFsInstructores());
        await GenerarPDFsInstructores()

    }

    async function GenerarPDFsInstructores() {
        const horarioService = new HorarioPDFServicio();
        try {
            const crearHorarioInstructores = new CrearHorarioInstructores();
            const horarioMapInstructores = await crearHorarioInstructores.ObtenerHorarioInstructores();
            // console.log(horarioMapInstructores);
            const PDFsInstructores = [];
            for (const [clave, horarioInstructor] of horarioMapInstructores) {
                let pdfHorario = new jsPDF({
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                });
                pdfHorario.setFont('helvetica');
                pdfHorario.text('', 20, 20);
                await pdfHorario
                    .html(renderToString(crearHorarioInstructores.GetTablaHorarioInstructor(horarioInstructor)),{
                        x: 20,
                        y: 20,
                        autoPaging: true
                    });

                const pdfData = pdfHorario.output('arraybuffer');
                const uint8Array = new Uint8Array(pdfData);

                PDFsInstructores.push({
                    nombre: `${horarioInstructor.nombre}.pdf`,
                    contenido: uint8Array
                });
                await horarioService.GuardarPDFsInstructores(PDFsInstructores);
            }
            await horarioService.AbrirCarpetaPDFs();
        } catch (error) {
            Swal.fire(error.toString());
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