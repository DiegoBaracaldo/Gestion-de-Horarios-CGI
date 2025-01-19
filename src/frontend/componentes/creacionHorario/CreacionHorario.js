import { useEffect, useState } from 'react';
import BotonDispHoraria from '../botonDIspHoraria/BotonDispHoraria';
import './CreacionHorario.css';
import Swal from 'sweetalert2';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import FranjaHoraria from '../franjaHoraria/FranjaHoraria';

const CreacionHorario = ({ competencia, bloque, franjas, setListaBloques, bloqueNumero,
    ocupanciaJornada, tipoJornada
}) => {

    //con las franjas se trabajan los bloques y todo el tema del horario

    //Manejo de bloques
    const [bloques, setBloques] = useState([]);
    const [instructorBloque, setInstructorBloque] = useState({});
    const [ambienteBloque, setAmbienteBloque] = useState({});
    const [franjasBloque, setFranjasBloque] = useState([]);


    useEffect(() => {
        //En cada carga debe trabajar el tema de franjas que incluyen instructores y ambientes
        //por bloques en cada competencia, es decir, algoritmo central del programa

        FormarBloques();
    }, []);

    //Matriz para generar la matriz visual del horario
    const [matrizHorario, setMatrizHorario] = useState(
        new Array(48).fill(null).map((valorFila, i) => {
            const arrayAux = [];
            for (let j = 0; j < 7; j++) {
                const objAux = {};
                objAux.valor = (7 * i) + j + 1;
                //Los colores pueden ser white, red and green
                objAux.colorCelda = 'white'
                arrayAux.push(objAux);
            }
            return arrayAux;
        })
    );

    //******************************************************************************************//
    //********** SECCIÓN PARA MANEJAR PINTADA DE CELDAS Y RECOLECCIÓN DE FRANJAS ***************//

    const [arrastrandoVerde, setArrastrandoVerde] = useState(false);
    const [arrastrandoBlanco, setArrastrandoBlanco] = useState(false);
    const [datosFranjaArrastre, setDatosFranjaArrastre] = useState([-1, -1, 0]);

    const ManejarClickFranja = (i, j) => {
        const matrixAux = [...matrizHorario];
        const colorCelda = matrixAux[i][j].colorCelda;
        matrixAux[i][j].colorCelda = colorCelda === 'white' ? 'green' : 'white';
        setMatrizHorario(matrixAux);
    }

    const ManejarClickDownFranja = (colorPintado) => {
        if (colorPintado === 'white') setArrastrandoVerde(true);
        else if (colorPintado === 'green') setArrastrandoBlanco(true);
    }

    const ManejarArrastreFranjas = (i, j, valor) => {
        if (datosFranjaArrastre[2] !== valor) {
            setDatosFranjaArrastre([i, j, valor]);
        }
    }

    //Recibiendo todos los datos de la celda arrastrada
    useEffect(() => {
        if (datosFranjaArrastre[0] >= 0 && datosFranjaArrastre[1] >= 0) {
            // console.log(datosFranjaArrastre);
            const i = datosFranjaArrastre[0];
            const j = datosFranjaArrastre[1];
            const valorFranja = datosFranjaArrastre[2];
            const matrixAux = [...matrizHorario];
            if (arrastrandoBlanco) {
                matrixAux[i][j].colorCelda = 'white';
            } else if (arrastrandoVerde) {
                matrixAux[i][j].colorCelda = 'green';
            }
            setMatrizHorario(matrixAux);
        }
    }, [datosFranjaArrastre]);

    const ManejarClickUpFranja = () => {
        setArrastrandoVerde(false);
        setArrastrandoBlanco(false);
        setDatosFranjaArrastre(-1, -1, 0);
    }

    const PintandoVerde = () => {

    }

    const PintandoBlanco = () => {

    }


    //******************************************************************************************//
    //******************************************************************************************//

    function PintarFranjasBloque() {
        if (bloque.franjas && bloque.franjas.length > 0) {
            PintarFranjas('green', bloque.franjas);
        }
    }

    function PintarFranjasOcupanciaJornada() {
        if (Array.isArray(ocupanciaJornada) && ocupanciaJornada.length > 0) {
            PintarFranjas('red', ocupanciaJornada);
        }
    }

    function PintarFranjas(color, listaFranjas) {
        //console.log(listaFranjas);
        //algortimo para entrar de una vez al índice y cambiarlo
        //en lugar de recorrer todo el array buscando la coincidencia
        const auxMatriz = [...matrizHorario];
        if (listaFranjas && listaFranjas.length > 0) {
            for (const franja of listaFranjas) {
                const indexMatriz = GetMatrizIndexFromValue(franja);
                const iAux = indexMatriz[0];
                const jAux = indexMatriz[1];
                auxMatriz[iAux][jAux].colorCelda = color;
            }
            setMatrizHorario([...auxMatriz]);
        }
    }

    //Generar variables para primera columna de la matriz que indica el rango horario
    function GetRango(indice) {
        const cantidadMinutos = indice * 30;
        const desdeHora = String(Math.floor(cantidadMinutos / 60)).padStart(2, '0');
        const desdeMinutos = String(cantidadMinutos % 60).padStart(2, '0');
        const hastaHora = String(Math.floor((cantidadMinutos + 30) / 60)).padStart(2, '0');
        const hastaMinutos = String((cantidadMinutos + 30) % 60).padStart(2, '0');
        return `${desdeHora}:${desdeMinutos} - ${hastaHora}:${hastaMinutos}`;
    }

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
        if (bloque && Object.values(bloque).length > 0) {
            ObtenerInstructor(bloque.idInstructor);
            ObtenerAmbiente(bloque.idAmbiente);
            setFranjasBloque([...bloque.franjas]);
        }
    }, [bloque]);

    //Cada que se selecciona un bloque
    useEffect(() => {
        PintarFranjasBloque();
        PintarFranjasOcupanciaJornada();
    }, [franjasBloque]);

    function GetMatrizIndexFromValue(valor) {
        // (Convertir bloque en índice de celda)
        //primero calculamos i
        const iCrudo = valor / 7;
        const residuo = valor % 7;
        //para entender la siguiente fórmula, ver formula inversa de franja a índice en matriz
        const iReal = residuo === 0 ? iCrudo - 1 : Math.trunc(iCrudo);
        const jReal = valor - 1 - (7 * iReal);
        return [iReal, jReal];
    }

    return (
        <div id="contCreacionHorarioVista">
            <div className='descripcionCompetenciaSelecc'>
                <h3>competencia {competencia && competencia.id}</h3>
                <label className='etDescrip'>Descripción:</label>
                <div className='parteAbajoDescripCompet'>
                    <textarea disabled value={competencia && competencia.descripcion} />
                    <div className='divisionIzq'>
                        <label>
                            <span className='datoDinamico'>{tipoJornada}</span>
                        </label>
                        <label>Bloque: <span className='datoDinamico'>
                            {typeof bloqueNumero === 'number' && bloqueNumero > 0 ? bloqueNumero : '?'}
                        </span>
                        </label>
                        <label>Horas: <span className='datoDinamico'>
                            {bloque && Object.values(bloque).length > 0 ? bloque.franjas.length / 2 : '~'}
                            {" / "}
                            {competencia ? competencia.horasRequeridas : 0}
                        </span>
                        </label>
                    </div>
                </div>
            </div>
            {
                bloque && Object.values(bloque).length > 0 ?
                    <div className='seleccInstrucAmbienteCompSelecc'>
                        <button className='seleccInstructorBtn'
                            style={{ backgroundColor: bloque.idInstructor ? '#39A900' : '#385C57' }}>
                            {instructorBloque && Object.values(instructorBloque).length > 0 ?
                                instructorBloque.nombre
                                : 'seleccionar instructor...'}
                        </button>
                        <button className='seleccAmbienteBtn'
                            style={{ backgroundColor: bloque.idAmbiente ? '#39A900' : '#385C57' }}>
                            {ambienteBloque && Object.values(ambienteBloque).length > 0 ?
                                ambienteBloque.nombre
                                : 'seleccionar ambiente..'}
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
                                <div className='contTablaMatrizHorarioCreacion'>
                                    <table className='tablaMatrizHorarioCreacion'>
                                        <thead>
                                            <tr>
                                                <th >hora</th>
                                                <th >lun</th>
                                                <th >mar</th>
                                                <th >mie</th>
                                                <th >jue</th>
                                                <th >vie</th>
                                                <th >sab</th>
                                                <th >dom</th>
                                            </tr>
                                        </thead>
                                        <tbody onMouseUp={ManejarClickUpFranja}
                                            onMouseLeave={ManejarClickUpFranja}>
                                            {
                                                matrizHorario.map((fila, i) => (
                                                    <tr key={i}>
                                                        <td className='colRango'>{GetRango(i)}</td>
                                                        {fila.map((colum, j) => (
                                                            <td key={j}
                                                                className={`colFranja 
                                                                 celda${colum.colorCelda}`}
                                                                onClick={() => ManejarClickFranja(i, j)}
                                                                onMouseDown={() => ManejarClickDownFranja(colum.colorCelda)}
                                                                onMouseMove={arrastrandoBlanco || arrastrandoVerde ?
                                                                    () => ManejarArrastreFranjas(i, j, colum.valor) : null}>
                                                                {colum.valor}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
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