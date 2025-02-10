import { useNavigate } from 'react-router-dom';
import BotonDestructivo from '../../componentes/botonDestructivo/BotonDestructivo';
import BotonPositivo from '../../componentes/botonPositivo/BotonPositivo';
import MarcoGralHorario from '../../componentes/marcoGeneralHorario/MarcoGralHorario';
import './HorarioPDF.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HorarioPDFServicio from '../../../backend/repository/servicios/HorarioPDFServicie';
import Swal from 'sweetalert2';
import CrearHorarioInstructores from './HorarioInstructores';
import jsPDF from 'jspdf';
import { renderToString } from 'react-dom/server';
import CrearHorarioGrupos from './HorarioGrupos';
import SWALDescarga from '../../alertas/SWALDescarga';
import LoadingNoStop from '../../componentes/loadingNoStop/LoadingNoStop';


const HorarioPDF = () => {

    const navegar = useNavigate(-1);
    const [horarioHaCambiado, setHorarioHaCambiado] = useState(true);
    const [creandoPDFS, setCreandoPDFS] = useState(false);

    useLayoutEffect(() => {
        const VerificarAlteracionHorario = async() => {
            const detectarHorarioAlterado = await DetectarHorarioAlterado();
            setHorarioHaCambiado(detectarHorarioAlterado);
        }
        VerificarAlteracionHorario();
    }, []);

    const GenerarPDFS = async () => {
        try {
            setCreandoPDFS(true);
            await GenerarPDFsGrupos();
            await GenerarPDFsInstructores();
            await new HorarioPDFServicio().SetHorarioCambiadoFalse();
            const detectarHorarioAlterado = await DetectarHorarioAlterado();
            setHorarioHaCambiado(detectarHorarioAlterado);
            setCreandoPDFS(false);
            Swal.fire("Archivos generados correctamente!");
        } catch (error) {
            console.log(error);
            Swal.fire("Error al construir PDF's!");
        }
    }

    const DescargarPDFInstructores = async () => {
        const servicioHorarioPDF = new HorarioPDFServicio();
        try {
            const rutaDevuelta = await servicioHorarioPDF.DescargarPDFInstructores();
            if(rutaDevuelta){
                const respuesta = await new SWALDescarga().descargaAlert();
                if(respuesta === 'si') await servicioHorarioPDF.AbrirCarpetaPDFs(rutaDevuelta);
            }
        } catch (error) {
            Swal.fire(error.toString());
        }
    }

    const DescargarPDGrupos = async () => {
        const servicioHorarioPDF = new HorarioPDFServicio();
        try {
            const rutaDevuelta = await servicioHorarioPDF.DescargarPDFGrupos();
            if(rutaDevuelta){
                const respuesta = await new SWALDescarga().descargaAlert();
                if(respuesta === 'si') await servicioHorarioPDF.AbrirCarpetaPDFs(rutaDevuelta);
            }
        } catch (error) {
            Swal.fire(error);
        }
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
                    .html(renderToString(crearHorarioInstructores.GetTablaHorarioInstructor(horarioInstructor)), {
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
        } catch (error) {
            Swal.fire(error.toString());
        }
    }

    async function GenerarPDFsGrupos() {
        const horarioService = new HorarioPDFServicio();
        try {
            const crearHorarioGrupos = new CrearHorarioGrupos();
            const horarioMapGrupos = await crearHorarioGrupos.ObtenerHorarioGrupos();
            // console.log(horarioMapInstructores);
            const PDFsInstructores = [];
            for (const [clave, horarioGrupo] of horarioMapGrupos) {
                let pdfHorario = new jsPDF({
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                });
                pdfHorario.setFont('helvetica');
                pdfHorario.text('', 20, 20);
                await pdfHorario
                    .html(renderToString(crearHorarioGrupos.GetTablaHorarioGrupo(horarioGrupo)), {
                        x: 20,
                        y: 20,
                        autoPaging: true
                    });

                const pdfData = pdfHorario.output('arraybuffer');
                const uint8Array = new Uint8Array(pdfData);

                PDFsInstructores.push({
                    nombre: `${horarioGrupo.codigoGrupo}.pdf`,
                    contenido: uint8Array
                });
                await horarioService.GuardarPDFsGrupos(PDFsInstructores);
            }
        } catch (error) {
            Swal.fire(error.toString());
        }
    }

    async function DetectarHorarioAlterado() {
        //lógica para detectar si horario ha cambiado desde la última generación de PDF
        try {
            const respuesta = await new HorarioPDFServicio().EncontrarValor('horarioCambiado');
            if(respuesta === 'false') return false
            else if (respuesta === 'true') return true;
            else return false;
        } catch (error) {
            Swal.fire(error);
            return false;
        }
    }

    return (
        <div id='contHorarioPDF'>
            <MarcoGralHorario
                titulo={'horario pdf'}>
                <div className='contInternoHorarioPDF'>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`generar pdf's`} disabledProp={!horarioHaCambiado}
                            onClick={GenerarPDFS} />
                    </div>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`descargar pdf's instructores`} disabledProp={horarioHaCambiado} 
                            onClick={DescargarPDFInstructores}/>
                    </div>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`descargar pdf's grupos`} disabledProp={horarioHaCambiado} 
                            onClick={DescargarPDGrupos}/>
                    </div>
                    <div className='contBtnPositivo'>
                        <BotonPositivo
                            texto={`enviar pdf's automáticamente `} disabledProp={true} />
                    </div>
                </div>
            </MarcoGralHorario>
            <div className='contBotones'>
                <BotonDestructivo
                    texto={`atrás`}
                    onClick={() => navegar(-1)} />
            </div>
            {
                creandoPDFS ? <LoadingNoStop texto={'cargando archivos pdf'}/> : null
            }
            
        </div>
    );
}
export default HorarioPDF;