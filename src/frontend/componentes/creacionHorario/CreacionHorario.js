import { useEffect, useLayoutEffect, useState } from 'react';
import BotonDispHoraria from '../botonDIspHoraria/BotonDispHoraria';
import './CreacionHorario.css';
import Swal from 'sweetalert2';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import FranjaHoraria from '../franjaHoraria/FranjaHoraria';

const CreacionHorario = ({ competencia, bloque, bloqueNumero,
    ocupanciaJornada, tipoJornada, bloqueDevuelto, esPrimeraCargaBloque,
    devolverFalsePrimeraCarga
}) => {

    //con las franjas se trabajan los bloques y todo el tema del horario

    //Manejo de bloques
    const [instructorBloque, setInstructorBloque] = useState({});
    const [ambienteBloque, setAmbienteBloque] = useState({});
    const [franjasBloque, setFranjasBloque] = useState(new Set());
    const franjasLibres = new Set(Array.from({ length: 336 }, (_, i) => i + 1));

    useEffect(() => {
        if (esPrimeraCargaBloque) {
            //Se cargan los datos del bloque en cuestión por primera vez
            setInstructorBloque(ObtenerInstructor());
            setAmbienteBloque(ObtenerAmbiente());
            setFranjasBloque(new Set(bloque.franjas));
            //Vuelo a ponerle en false
            if (typeof devolverFalsePrimeraCarga === 'function') devolverFalsePrimeraCarga();
        }
    }, [esPrimeraCargaBloque]);

    useEffect(() => {
        
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
    //**********     ENVIANDO DE VUELTA EL BLOQUE CON NUEVOS DATOS     ***************//

    useEffect(() => {
        //Se reinician el isntructor y ambiente dada la modificación de las franjas
        // console.log(franjasBloque);
        if (typeof bloqueDevuelto === 'function') {
            const bloqueAux = {
                ...bloque,
                idInstructor: null,
                idAmbiente: null,
                franjas: franjasBloque
            }
            bloqueDevuelto(bloqueAux);
        }
    }, [franjasBloque]);

    useEffect(() => {
        if (typeof bloqueDevuelto === 'function') {
            const bloqueAux = {
                ...bloque,
                idInstructor: instructorBloque.id
            }
            bloqueDevuelto(bloqueAux);
        }
    }, [instructorBloque]);

    useEffect(() => {
        if (typeof bloqueDevuelto === 'function') {
            const bloqueAux = {
                ...bloque,
                idAmbiente: ambienteBloque.id
            }
            bloqueDevuelto(bloqueAux);
        }
    }, [ambienteBloque]);
    //******************************************************************************************//
    //******************************************************************************************//

    //******************************************************************************************//
    //********** SECCIÓN PARA MANEJAR PINTADA DE CELDAS Y RECOLECCIÓN DE FRANJAS ***************//

    const [arrastrandoVerde, setArrastrandoVerde] = useState(false);
    const [arrastrandoBlanco, setArrastrandoBlanco] = useState(false);
    const [valorArrastre, setValorArrastre] = useState(0);

    //Para clic individual sin arrastre
    const ManejarClickFranja = (valor, color) => {
        const auxFranjasBloque = new Set(franjasBloque);
        if (color === 'white') {
            auxFranjasBloque.add(valor);
        } else if(color === 'green') {
            auxFranjasBloque.delete(valor);
        }
        setFranjasBloque(auxFranjasBloque);
    }

    const ManejarClickDownFranja = (colorPintado) => {
        if (colorPintado === 'white') setArrastrandoVerde(true);
        else if (colorPintado === 'green') setArrastrandoBlanco(true);
    }

    const ManejarArrastreFranjas = (valor) => {
        if (valorArrastre !== valor) {
            setValorArrastre(valor);
        }
    }

    //Recibiendo todos los datos de la celda arrastrada
    useEffect(() => {
        if (valorArrastre >= 0 ) {
            // console.log(datosFranjaArrastre);
            if (arrastrandoBlanco) {
                setFranjasBloque(() => {
                    const auxLista = new Set(franjasBloque);
                    auxLista.delete(valorArrastre);
                    return auxLista;
                });
            } else if (arrastrandoVerde) {
                setFranjasBloque(new Set(franjasBloque).add(valorArrastre));
            }
        }
    }, [valorArrastre]);

    const ManejarClickUpFranja = () => {
        setArrastrandoVerde(false);
        setArrastrandoBlanco(false);
        setValorArrastre(0);
    }

    //******************************************************************************************//
    //******************************************************************************************//


    function PintarFranjas(verdes, blancas, rojas) {
        //algortimo para entrar de una vez al índice y cambiarlo
        ////en lugar de recorrer todo el array buscando la coincidencia
        const auxMatriz = [...matrizHorario];
    //    console.log("vamoa pintar...");
        verdes.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'green';
        });
        blancas.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'white';
        });
        rojas.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'red';
        });
        setMatrizHorario([...auxMatriz]);
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

    async function ObtenerInstructor(idInstructor) {
        try {
            return await new InstructorServicio().CargarInstructor(idInstructor);
        } catch (error) {
            Swal.fire(error);
        }
    }

    async function ObtenerAmbiente(idAmbiente) {
        try {
            return await new AmbienteServicio().CargarAmbiente(idAmbiente);
        } catch (error) {
            Swal.fire(error);
        }
    }

    //CADA QUE CAMBIA EL BLOQUE 
    useLayoutEffect(() => {
        if (bloque && Object.values(bloque).length > 0) {
            //Se pintan las celdas de su color correspondiente pero se obtienen
            ///primero las libres para completar las 3 (verdes, blancas, rojas)
            ocupanciaJornada.forEach(franja => franjasLibres.delete(franja));
            bloque.franjas.forEach(franja => franjasLibres.delete(franja));
            PintarFranjas(bloque.franjas, franjasLibres, ocupanciaJornada);
        }
    }, [bloque]);

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
                        <button className={franjasBloque.size <= 0 ?
                            'seleccInstructorBtn btnOff'
                            : 'seleccInstructorBtn'}
                            style={{ backgroundColor: bloque.idInstructor ? '#39A900' : '#385C57' }}>
                            {instructorBloque && Object.values(instructorBloque).length > 0 ?
                                instructorBloque.nombre
                                : 'seleccionar instructor...'}
                        </button>
                        <button className={franjasBloque.size <= 0 ?
                            'seleccAmbienteBtn btnOff'
                            : 'seleccAmbienteBtn'}
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
                                                                onClick={() => ManejarClickFranja(colum.valor, colum.colorCelda)}
                                                                onMouseDown={() => ManejarClickDownFranja(colum.colorCelda)}
                                                                onMouseMove={arrastrandoBlanco || arrastrandoVerde ?
                                                                    () => ManejarArrastreFranjas(colum.valor) : null}>
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