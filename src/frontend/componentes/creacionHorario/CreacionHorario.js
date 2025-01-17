import { useEffect, useState } from 'react';
import BotonDispHoraria from '../botonDIspHoraria/BotonDispHoraria';
import './CreacionHorario.css';
import Swal from 'sweetalert2';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import FranjaHoraria from '../franjaHoraria/FranjaHoraria';

const CreacionHorario = ({ competencia, bloque, franjas, setListaBloques, bloqueNumero }) => {

    //con las franjas se trabajan los bloques y todo el tema del horario

    //Manejo de bloques
    const [bloques, setBloques] = useState([]);
    const [instructorBloque, setInstructorBloque] = useState({});
    const [ambienteBloque, setAmbienteBloque] = useState({});


    useEffect(() => {
        //En cada carga debe trabajar el tema de franjas que incluyen instructores y ambientes
        //por bloques en cada competencia, es decir, algoritmo central del programa

        FormarBloques();
    }, []);

    function FormarBloques() {
        if (Array.isArray(franjas) && franjas.length > 0) {
            console.log("Empezando a crear bloques...");
            let franjasAux = [...franjas];
            const bloquesAux = [];
            let contadorAuxiliarLog = 0;
            while (franjasAux.length > 0) {
                //Se toman los datos iniciales de comparación en cada ciclo
                const instructorAux = franjasAux[0].idInstructor;
                const ambienteAux = franjasAux[0].idAmbiente;
                const coincidencias = franjasAux.filter
                    (franja => (franja.idInstructor === instructorAux && franja.idAmbiente === ambienteAux));
                if (coincidencias.length > 0) {
                    const objBloqueAux = {
                        ...{
                            idInstructor: coincidencias[0].idInstructor,
                            idAmbiente: coincidencias[0].idAmbiente,
                            franjas: coincidencias.map(franja => franja.franja)
                        }
                    };
                    bloquesAux.push(objBloqueAux);
                    //Ahora elimino los datos usados de la lista iterada para crear el bloque
                    for (let i = 0; i < coincidencias.length; i++) {
                        const indexAux = franjasAux.findIndex(franja =>
                            franja.idInstructor === instructorAux &&
                            franja.idAmbiente === ambienteAux &&
                            franja.franja === coincidencias[i].franja
                        );
                        if (indexAux >= 0) {
                            franjasAux.splice(indexAux, 1);
                        }
                    }
                }

                contadorAuxiliarLog = contadorAuxiliarLog + 1;
            }
            //Cuando termina el ciclo
            console.log("El  ciclo tuvo " + contadorAuxiliarLog + " iteraciones.");
            console.log("La cantidad de bloques es: " + bloquesAux.length);
            setBloques(bloquesAux);
        }
    }

    async function ObtenerInstructor(idInstructor) {
        try {
            const respuesta = await new InstructorServicio().CargarInstructor(idInstructor);
            setInstructorBloque(respuesta);
        } catch (error) {
            Swal.fire(error);
        }
    }

    async function ObtenerAmbiente(idAmbiente) {
        try {
            const respuesta = await new AmbienteServicio().CargarAmbiente(idAmbiente);
            setAmbienteBloque(respuesta);
        } catch (error) {
            Swal.fire(error);
        }
    }

    useEffect(() => {
        if (typeof setListaBloques === 'function') {
            setListaBloques(bloques);
        }
    }, [bloques]);

    useEffect(() => {
        if(bloque.idInstructor) ObtenerInstructor(bloque.idInstructor);
        if(bloque.idAmbiente) ObtenerAmbiente(bloque.idAmbiente);
    }, [bloque]);

    return (
        <div id="contCreacionHorarioVista">
            <div className='descripcionCompetenciaSelecc'>
                <h3>competencia {competencia && competencia.id}</h3>
                <label className='etDescrip'>Descripción:</label>
                <div className='parteAbajoDescripCompet'>
                    <textarea disabled value={competencia && competencia.descripcion} />
                    <div className='divisionIzq'>
                        <label>Bloque: <span className='datoDinamico'>
                            {typeof bloqueNumero === 'number' && bloqueNumero > 0 && bloqueNumero}
                        </span></label>
                        <label>Horas: <span className='datoDinamico'>
                            {bloque && Object.values(bloque).length > 0 && bloque.franjas.length / 2}
                            {" / "}
                            {competencia ? competencia.horasRequeridas : 0}
                        </span></label>
                    </div>
                </div>
            </div>
            {
                bloque && Object.values(bloque).length > 0 ?
                    <div className='seleccInstrucAmbienteCompSelecc'>
                        <button className='seleccInstructorBtn'
                        style={{backgroundColor: bloque.idInstructor ? '#39A900' : '385C57'}}>
                            {instructorBloque.nombre || 'Seleccionar Instructor...'}
                        </button>
                        <button className='seleccAmbienteBtn'
                        style={{backgroundColor: bloque.idAmbiente ? '#39A900' : '385C57'}}>
                             {ambienteBloque.nombre || 'Seleccionar ambiente..'}
                             </button>
                    </div>
                    :
                    <h2 style={{ padding: '10px 20px' }}>
                        Selecciona un bloque o crea uno nuevo...
                    </h2>
            }
            {
                bloque && Object.values(bloque).length > 0 ?
                    <div className='SeccionHorarioCompSelecc'>
                        {
                            bloque.franjas ?
                            null
                            :
                            null
                        }
                    </div>
                    : null
            }
        </div>
    );
}
export default CreacionHorario;