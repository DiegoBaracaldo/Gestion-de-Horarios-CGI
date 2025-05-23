import { useEffect, useLayoutEffect, useState } from 'react';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import './FranjaHoraria.css';

const FranjaHoraria = ({ onClickPositivo, onClickDestructivo, franjaProp, franjasOcupadasProp, esConsulta,
    esEdicion, horarioCompleto, franjasDescartadasAux, setFranjasDescartadasAux
}) => {

    //captura las franjas iniciales
    let franjasOcupadasIniciales = franjasOcupadasProp;
    //Captura el horario completo a quitando el propio de la jornada consultada


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
            /* Ir llenando cada columna de la fila */
            let filaAux = [];
            for (let j = 0; j < 7; j++) {
                //analizar si la celda está ocupada para pintarla de  rojo e inhabilitarla
                let celdaOcupada = false;
                let celdaVerde = false;
                if (Array.isArray(franjasOcupadasIniciales)) {
                    if (esConsulta) {
                        const verificarColor = franjasOcupadasIniciales.includes(contadorAlgoritmo);
                        if (verificarColor) celdaVerde = true;
                        else celdaOcupada = true;

                    } else {
                        //Si es registro o edición se prohiben las franjas ya usadas
                        //pero se pintan de verde las que le pertenecen al horario en cuestión
                        if (Array.isArray(horarioCompleto) && Array.isArray(franjasDescartadasAux)) {
                            //Si le pertenece al horario en cuestión se ponen de verde y no de rojo
                            celdaVerde = franjasOcupadasIniciales.includes(contadorAlgoritmo);
                            if (!celdaVerde) {
                                //SI no, se evalúan en el hroario comppleto depurado para pintar de rojo o no

                                celdaOcupada = horarioCompleto.includes(contadorAlgoritmo)
                                    && !franjasDescartadasAux.includes(contadorAlgoritmo);
                            }
                        } else {
                            celdaVerde = franjasOcupadasIniciales.includes(contadorAlgoritmo);
                        }
                    }
                }
                const auxDato = {
                    valor: contadorAlgoritmo,
                    pintadoVerde: celdaVerde,
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
        if (!esConsulta) {
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
        //Si no  se trata de las jornadas
        if (!Array.isArray(horarioCompleto)) {
            matrizCeldasFranja.forEach(fila => {
                fila.forEach(celda => {
                    if (celda.pintadoVerde || celda.pintadoRojo) nuevaLista.push(celda.valor);
                });
            });
        } else {
            //SI SI  se trata de las jornadas
            if (esConsulta) {
                matrizCeldasFranja.forEach(fila => {
                    fila.forEach(celda => {
                        if (celda.pintadoRojo) nuevaLista.push(celda.valor);
                    });
                });
            } else {
                matrizCeldasFranja.forEach(fila => {
                    fila.forEach(celda => {
                        if (celda.pintadoVerde) nuevaLista.push(celda.valor);
                    });
                });
            }
        }

        setFranjas(nuevaLista);
    }, [matrizCeldasFranja]);

    //Se pasa la selección de franjas mediante prop al padre
    useEffect(() => {
        if (typeof franjaProp === 'function') franjaProp(franjas);
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
        //Son 48 filas
        for (let i = 0; i < 48; i++) {
            //Se crea primero la columna que indica de qué hora a qujé hora va
            const horas = String(Math.floor(contadorMinutos / 60)).padStart(2, '0');
            const minutos = String(contadorMinutos % 60).padStart(2, '0');
            const horasnext = String(Math.floor((contadorMinutos + 30) / 60)).padStart(2, '0');
            const minutosNext = String((contadorMinutos + 30) % 60).padStart(2, '0');
            //Se agrega ahora cada columna de izuierda a derecha
            listaAux.push(
                <tr key={`fila${i + 1}`}>
                    <td className={classCeldaHora}>{horas}:{minutos} - {horasnext}:{minutosNext}</td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][0].pintadoVerde && ' celdaFranjaPintada'} ${matrizCeldasFranja[i][0].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`lunes${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}
                        style={{cursor: esConsulta ? 'default' : 'cell'}}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][1].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][1].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`martes${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}
                        style={{cursor: esConsulta ? 'default' : 'cell'}}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][2].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][2].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`miercoles${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}
                        style={{cursor: esConsulta ? 'default' : 'cell'}}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][3].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][3].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`jueves${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}
                        style={{cursor: esConsulta ? 'default' : 'cell'}}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][4].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][4].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`viernes${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}
                        style={{cursor: esConsulta ? 'default' : 'cell'}}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][5].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][5].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`sabado${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}
                        style={{cursor: esConsulta ? 'default' : 'cell'}}></td>
                    <td className={`celdaFranja ${matrizCeldasFranja[i][6].pintadoVerde && 'celdaFranjaPintada'} ${matrizCeldasFranja[i][6].pintadoRojo && 'franjaOcupada'}`}
                        onMouseDown={(e) => ClicCeldaMatriz(i, e)} key={`domingo${i + 1}`}
                        onMouseUp={TerminarArrastre}
                        onMouseMove={(e) => ManejarArrastre(i, e)}
                        style={{cursor: esConsulta ? 'default' : 'cell'}}></td>
                </tr>
            );
            contadorMinutos = contadorMinutos + 30;
        };
        return listaAux;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    const ManejarCancelar = () => {
        //Para que  no permanezca la selección al cancelar el modal SOLO EN MODO REGISTRO
        //if(!esConsulta && !esEdicion)franjaProp && franjaProp([]);
        if (typeof onClickDestructivo === 'function') {
            franjaProp(franjasOcupadasIniciales);
            onClickDestructivo();
        } else {
            alert("Debes agregar funcionalidad a este componente!");
        }
    }

    const ManejarClicPositivo = () => {
        if (typeof setFranjasDescartadasAux === 'function') {
            //Si los numeros de la lista inicial ya no están en franjas
            const listaDescartadas = franjasOcupadasIniciales.filter(franja => !franjas.includes(franja));
            setFranjasDescartadasAux(listaDescartadas);
        }
        if (typeof onClickPositivo === 'function') onClickPositivo();
    }

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
                        <tbody
                            onMouseLeave={TerminarArrastre}
                            onMouseUp={TerminarArrastre}>
                            {listaHora}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='botones'>
                <div className='contMapaColores'>
                    <div className='muestraColor muestraColorRojo'></div>
                    <label>{esConsulta ? 'Franja NO asignada' : 'Franja NO disponible'}</label>
                </div>
                {
                    esConsulta ? null :
                        <div className='contMapaColores'>
                            <div className='muestraColor muestraColorBlanco'></div>
                            <label>Franja disponible</label>
                        </div>
                }
                <div className='contMapaColores'>
                    <div className='muestraColor muestraColorVerde'></div>
                    <label>{esConsulta ? 'Disponibilidad Asignada' : 'Franja seleccionada'}</label>
                </div>
                <div className='contBtnPositivo contBtn'>
                    {
                        esConsulta ? null :
                            <BotonPositivo texto="Registrar"
                                onClick={ManejarClicPositivo} />
                    }
                </div>
                <div className='contBtnDestructivo contBtn'>
                    <BotonDestructivo texto="Cancelar"
                        onClick={ManejarCancelar} />
                </div>
            </div>
        </div>
    );
}
export default FranjaHoraria;