import { useEffect, useLayoutEffect, useState } from 'react';
import BotonDispHoraria from '../botonDIspHoraria/BotonDispHoraria';
import './CreacionHorario.css';
import Swal from 'sweetalert2';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import FranjaHoraria from '../franjaHoraria/FranjaHoraria';
import CrudInstructores from '../../paginas/crudInstructores/CrudInstructores';
import CrudAmbientes from '../../paginas/crudAmbientes/CrudAmbientes';

const CreacionHorario = ({ competencia, bloque, bloqueNumero,
    ocupanciaJornada, ocupanciaBloques, tipoJornada, bloqueDevuelto, esPrimeraCargaBloque,
    devolverFalsePrimeraCarga, devolverTotalHorasBloques, totalHorasTomadasComp, listaCompleta
}) => {

    //Manejo de bloques
    const [instructorBloque, setInstructorBloque] = useState({});
    const [ambienteBloque, setAmbienteBloque] = useState({});
    const [franjasBloque, setFranjasBloque] = useState(new Set());
    const [franjasLibres, setFranjasLibres] = useState(new Set(Array.from({ length: 336 }, (_, i) => i + 1)));

    useLayoutEffect(() => {
        if (esPrimeraCargaBloque) {
            // console.log("Primera Carga, bloque ", bloque);
            //Se cargan los datos del bloque en cuestión por primera vez
            if (bloque && bloque.instructor && Object.keys(bloque.instructor).length > 0)
                setInstructorBloque(bloque.instructor);
            else setInstructorBloque({});
            if (bloque && bloque.ambiente && Object.keys(bloque.ambiente).length > 0)
                setAmbienteBloque(bloque.ambiente);
            else setAmbienteBloque({});
            setFranjasBloque(new Set(bloque.franjas));
            //Vuelo a ponerle en false
            if (typeof devolverFalsePrimeraCarga === 'function') devolverFalsePrimeraCarga();
        }
    }, [esPrimeraCargaBloque, bloque]);

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
        if (typeof bloqueDevuelto === 'function' && !esPrimeraCargaBloque
            && Object.values(bloque).length > 0) {
            // console.log("El objeto antes de acomodar es: ", bloque);
            const bloqueAux = {
                ...bloque,
                franjas: new Set(franjasBloque)
            }
            // console.log("El objeto acomodado es: ", bloqueAux);
            bloqueDevuelto(bloqueAux);
        }
    }, [franjasBloque]);

    useEffect(() => {
        // console.log(instructorBloque);
        if (typeof bloqueDevuelto === 'function' && !esPrimeraCargaBloque
            && Object.values(bloque).length > 0) {
            const bloqueAux = {
                ...bloque,
                instructor: instructorBloque
            }
            bloqueDevuelto(bloqueAux);
        }
    }, [instructorBloque]);

    useEffect(() => {
        if (typeof bloqueDevuelto === 'function' && !esPrimeraCargaBloque
            && Object.values(bloque).length > 0) {
            const bloqueAux = {
                ...bloque,
                ambiente: ambienteBloque
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
        if (color === 'white' && totalHorasTomadasComp < competencia.horasRequeridas) {
            devolverTotalHorasBloques(totalHorasTomadasComp + 0.5)
            auxFranjasBloque.add(valor);
        } else if (color === 'green') {
            devolverTotalHorasBloques(totalHorasTomadasComp - 0.5)
            auxFranjasBloque.delete(valor);
        }
        setFranjasBloque(auxFranjasBloque);
    }

    const ManejarClickDownFranja = (colorPintado) => {
        setInstructorBloque({});
        setAmbienteBloque({});
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
        if (valorArrastre >= 0) {
            // console.log(datosFranjaArrastre);
            if (arrastrandoBlanco) {
                if (totalHorasTomadasComp >= 0.5) devolverTotalHorasBloques(totalHorasTomadasComp - 0.5)
                setFranjasBloque(() => {
                    const auxLista = new Set(franjasBloque);
                    auxLista.delete(valorArrastre);
                    return auxLista;
                });
            } else if (arrastrandoVerde && totalHorasTomadasComp < competencia.horasRequeridas) {
                devolverTotalHorasBloques(totalHorasTomadasComp + 0.5)
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


    function PintarFranjas(verdes, blancas, rojas, grises) {
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
        grises.forEach(franja => {
            const indexMatriz = GetMatrizIndexFromValue(franja);
            const iAux = indexMatriz[0];
            const jAux = indexMatriz[1];
            auxMatriz[iAux][jAux].colorCelda = 'gray';
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

    //CADA QUE CAMBIA EL BLOQUE o se modifica el actual
    useLayoutEffect(() => {
        // console.log(bloque);
        if (bloque && Object.values(bloque).length > 0) {
            // console.log(bloque);
            //Se pintan las celdas de su color correspondiente pero se obtienen
            ///primero las libres para completar las 3 (verdes, blancas, rojas)
            const auxFranjasLibres = new Set(franjasLibres);
            ocupanciaJornada.forEach(franja => auxFranjasLibres.delete(franja));
            bloque?.franjas?.forEach(franja => auxFranjasLibres.delete(franja));
            ocupanciaBloques.current.forEach(franja => auxFranjasLibres.delete(franja));
            PintarFranjas(bloque.franjas, auxFranjasLibres, ocupanciaJornada, ocupanciaBloques.current);
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


    //******************************************************************************************//
    //************************* ÁREA DE SELECCIÓN DE AMBIENTE E INSTRUCTOR *********************//

    const [openListaInstructores, setOpenListaInstructores] = useState(false);
    const [openListaAmbientes, setOpenListaAmbientes] = useState(false);


    //******************************************************************************************//
    //******************************************************************************************//

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
                        <label style={{
                            color: totalHorasTomadasComp === competencia.horasRequeridas ?
                                '#39A900' : '#DC3545 '
                        }}>
                            Horas: <span className='datoDinamico'>
                                {totalHorasTomadasComp}
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
                            style={{ backgroundColor: Object.values(instructorBloque).length > 0 ? '#39A900' : '#385C57' }}
                            onClick={() => setOpenListaInstructores(true)}>
                            {instructorBloque && Object.values(instructorBloque).length > 0 ?
                                `${instructorBloque.nombre}`
                                : 'seleccionar instructor '}
                        </button>
                        <button className={franjasBloque.size <= 0 ?
                            'seleccAmbienteBtn btnOff'
                            : 'seleccAmbienteBtn'}
                            style={{ backgroundColor: Object.values(ambienteBloque).length > 0 ? '#39A900' : '#385C57' }}
                            onClick={() => setOpenListaAmbientes(true)}>
                            {ambienteBloque && Object.values(ambienteBloque).length > 0 ?
                                ambienteBloque.nombre
                                : 'seleccionar ambiente '}
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
            {
                openListaInstructores ?
                    <CrudInstructores
                        onClose={() => setOpenListaInstructores(false)}
                        modoSeleccion={true}
                        responsableSeleccionado={(r) => setInstructorBloque(r)}
                        franjasDeseadas={[...franjasBloque]} 
                        listaCompletaGrupos={listaCompleta}/>
                    : null
            }
            {
                openListaAmbientes ?
                    <CrudAmbientes
                        modoSeleccion={true}
                        ambienteSelecc={(a) => setAmbienteBloque(a)}
                        onClose={() => setOpenListaAmbientes(false)}
                        franjasDeseadas={[...franjasBloque]}  
                        listaCompletaGrupos={listaCompleta}/>
                    : null
            }
        </div>
    );
}
export default CreacionHorario;