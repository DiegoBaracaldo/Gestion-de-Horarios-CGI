import { useEffect, useState } from 'react';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import './FranjaHoraria.css';

const FranjaHoraria = ({ onClickPositivo, onClickDestructivo, franjaProp, franjasOcupadasProp, esConsulta
}) => {

    const [matrizCeldasFranja, setMatrizCeldasFranja] = useState(ValorInicialMatriz());
    const [classCeldaHora, setClassCeldaHora] = useState('celdaHora');
    const [classCeldaTitulo, setClassCeldaTitulo] = useState('celdaTitulo');
    /* Hook para recolección de franjas horarias */
    const [franjas, setFranjas] = useState([]);
    /* Hooks para lógica de arrastre */
    const [inicioArrastrePintado, setInicioArrastrePintado] = useState(false)
    const [arrastrando, setArrastrando] = useState(false);
    const [ejeX, setEjeX] = useState(-1);
    const [ejeY, setEjeY] = useState(-1);

    function ValorInicialMatriz() {
        //Se debe mantener sincronizada la lista hora que con la matriz para que coincidan los clics
        let matrizAux = [];
        let contadorAlgoritmo = 1;
        /* Este ciclo es  para darle a cada celda cu valor para el algoritmo de creación de horario
        y tambiéen manejar el estado para saber si se debe pintar la celda o no */
        for (let i = 0; i < 48; i++) {
            /* Ir llenando cada fila */
            let filaAux = [];
            for (let j = 0; j < 7; j++) {
                //analizar si la celda está ocupada para pintarla de  rojo e inhabilitarla
                let celdaOcupada = false;
                if (franjasOcupadasProp) celdaOcupada = franjasOcupadasProp.includes(contadorAlgoritmo);
                const auxDato = {
                    valor: contadorAlgoritmo,
                    pintadoVerde: false,
                    pintadoRojo: celdaOcupada
                }
                //contadorAlgoritmo cuenta hasta 336
                contadorAlgoritmo++;
                // console.log(auxDato);
                filaAux.push(auxDato);
            }
            matrizAux.push(filaAux);
        }
        return (matrizAux);
    }

    const ClicCeldaMatriz = (fila, e) => {
        //Solo funciona  si no es consulta
        if(!esConsulta){
            const colum = e.target.cellIndex - 1;
            setArrastrando(true); //inciar arrastre
            setInicioArrastrePintado(matrizCeldasFranja[fila][colum].pintadoVerde);
            setEjeX(fila);
            setEjeY(colum);
            PintadoCelda(fila, e);
        }
    }
    const ManejarArrastre = (fila, e) => {
        const auxX = fila;
        const auxY = e.target.cellIndex - 1;
        if (arrastrando) {
            if (auxX !== ejeX || auxY !== ejeY) {
                PintadoCeldaArrastre(fila, e);
                setEjeX(fila);
                setEjeY(e.target.cellIndex - 1);
            }
        }
    }

    const TerminarArrastre = () => {
        setArrastrando(false);
    }

    useEffect(() => {
        if (!arrastrando) {
            setEjeX(-1);
            setEjeY(-1);
        }
    }, [arrastrando]);


    const PintadoCelda = (fila, e) => {
        /* se hace cellIndex-1, ya que al ser la primera columna la de la hora, el
         primer index detectado es el 1, y se necesita que sea cero, y así los siguientes números
         para que coincida con el array de valor y pintadoVerde */
        const colum = e.target.cellIndex - 1;
        setMatrizCeldasFranja(matrizCeldasFranja => {
            const nuevaMatriz = matrizCeldasFranja.map((element, i) => {
                if (i === fila) {
                    return element.map((subElement, j) => {
                        if (j === colum) {
                            return {
                                ...subElement,
                                pintadoVerde: !subElement.pintadoVerde
                            }
                        }
                        else return subElement;
                    });
                }
                else return element;
            });
            return nuevaMatriz;
        });
    }
    const PintadoCeldaArrastre = (fila, e) => {
        /* se hace cellIndex-1, ya que al ser la primera columna la de la hora, el
         primer index detectado es el 1, y se necesita que sea cero, y así los siguientes números
         para que coincida con el array de valor y pintadoVerde */
        const colum = e.target.cellIndex - 1;
        //Si la celda que inicia el arrastre está sin pintar
        if (!inicioArrastrePintado) {
            setMatrizCeldasFranja(matrizCeldasFranja => {
                const nuevaMatriz = matrizCeldasFranja.map((element, i) => {
                    if (i === fila) {
                        return element.map((subElement, j) => {
                            if (j === colum) {
                                return {
                                    ...subElement,
                                    pintadoVerde: true
                                }
                            }
                            else return subElement;
                        });
                    }
                    else return element;
                });
                return nuevaMatriz;
            });
        }
        //Si la celda que inicia el arrastre está pintada
        else {
            setMatrizCeldasFranja(matrizCeldasFranja => {
                const nuevaMatriz = matrizCeldasFranja.map((element, i) => {
                    if (i === fila) {
                        return element.map((subElement, j) => {
                            if (j === colum) {
                                return {
                                    ...subElement,
                                    pintadoVerde: false
                                }
                            }
                            else return subElement;
                        });
                    }
                    else return element;
                });
                return nuevaMatriz;
            });
        }

    }

    //Para guardar los valores seleccionados
    useEffect(() => {
        const nuevaLista = [];
        matrizCeldasFranja.forEach(fila => {
            fila.forEach(celda => {
                if (celda.pintadoVerde) nuevaLista.push(celda.valor);
            });
        });
        setFranjas(nuevaLista);
    }, [matrizCeldasFranja]);

    //Se pasa la selección de franjas mediante prop al padre
    useEffect(() => {
        franjaProp && franjaProp(franjas);
    }, [franjas]);

    //Para testear las franjas que se agregan al array
    // useEffect(() => {
    //     console.log(franjas);
    // }, [franjas]);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* CONSTANTE Y FUNCIÓN QUE CREA EL BODY DE LA TABLA! */
    const listaHora = ValorInicialListaHora();
    function ValorInicialListaHora() {
        let listaAux = [];
        let contadorMinutos = 0;
        for (let i = 0; i < 48; i++) {
            const horas = String(Math.floor(contadorMinutos / 60)).padStart(2, '0');
            const minutos = String(contadorMinutos % 60).padStart(2, '0');
            const horasnext = String(Math.floor((contadorMinutos + 30) / 60)).padStart(2, '0');
            const minutosNext = String((contadorMinutos + 30) % 60).padStart(2, '0');

            listaAux.push(
                <tr key={`fila${i + 1}`}>
                    <td className={classCeldaHora}>{horas}:{minutos} - {horasnext}:{minutosNext}</td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][0].pintadoVerde && ' celdaFranjaPintada'} ${matrizCeldasFranja[i][0].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`lunes${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][1].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][1].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`martes${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][2].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][2].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`miercoles${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][3].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][3].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`jueves${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][4].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][4].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`viernes${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][5].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][5].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`sabado${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][6].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][6].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`domingo${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}></td>
                </tr>
            );
            contadorMinutos = contadorMinutos + 30;
        };
        return listaAux;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div id='franjaHoraria'>
            <div className='franja'>
                <div className='contTabla'>
                    {/* se usa "TerminarArrastre" aquí para evitar error al salir de la tabla
                    mientras se mantiene clic presionado */}
                    <table onMouseLeave={TerminarArrastre}>
                        <thead>
                            <tr>
                                <th className={classCeldaHora} >hora</th>
                                <th className={classCeldaTitulo + ' lunesTitulo' + ' lunesColum'}>lunes</th>
                                <th className={classCeldaTitulo + ' martesTitulo' + ' martesColum'}>martes</th>
                                <th className={classCeldaTitulo + ' miercolesTitulo' + ' miercolesColum'}>miércoles</th>
                                <th className={classCeldaTitulo + ' juevesTitulo' + ' juevesColum'}>jueves</th>
                                <th className={classCeldaTitulo + ' viernesTitulo' + ' viernesColum'}>viernes</th>
                                <th className={classCeldaTitulo + ' sabadoTitulo' + ' sabadoColum'}>sábado</th>
                                <th className={classCeldaTitulo + ' domingoTitulo' + ' domingoColum'}>domingo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaHora}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='botones'>
                <div className='contMapaColores'>
                    <div className='muestraColor muestraColorRojo'></div>
                    <label> : Franja NO disponible</label>
                </div>
                <div className='contMapaColores'>
                    <div className='muestraColor muestraColorBlanco'></div>
                    <label> : Franja disponible</label>
                </div>
                {
                    esConsulta ? null :
                    <div className='contMapaColores'>
                        <div className='muestraColor muestraColorVerde'></div>
                        <label> : Franja seleccionada</label>
                    </div>
                }
                <div className='contBtnPositivo contBtn'>
                    {
                        esConsulta ? null :
                            <BotonPositivo texto="Registrar"
                                onClick={onClickPositivo ? () => onClickPositivo() :
                                    () => alert("debes poner funcionalidad al botón positivo!")
                                } />
                    }
                </div>
                <div className='contBtnDestructivo contBtn'>
                    <BotonDestructivo texto="Cancelar"
                        onClick={onClickDestructivo ? () => onClickDestructivo() :
                            () => alert("debes poner funcionalidad al botón destructivo!")} />
                </div>
            </div>
        </div>
    );
}
export default FranjaHoraria;