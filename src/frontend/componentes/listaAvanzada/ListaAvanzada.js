import { useEffect, useLayoutEffect, useState } from 'react';
import './ListaAvanzada.css';


const ListaAvanzada = ({ titulo, subtitulos, datosJson, clickFila, listaSeleccProp,
    modoSeleccion, vaciarListaSelecc, yaVienenSeleccionadas
}) => {

    //Valor de 10 por defecto como parche para cubrir el dinamismo de las columnas
    const [numFilas, setNumFilas] = useState(Array.isArray(datosJson) ? datosJson.length : 0);
    const [numColumnas, setNumColumnas] = useState(subtitulos ? subtitulos.length : 1);
    /*Array que guarda los "checks" de las  filas de la tabla*/
    const [selecciones, setSelecciones] = useState(Array(numFilas).fill(false));
    const [todosSelecc, setTodosSelecc] = useState(false);
    const [listaObjetosSelecc, setListaObjetosSelecc] = useState([]);

    const [yaVienenPrimera, setYaVienenPrimera] = useState(Array.isArray(yaVienenSeleccionadas) ? true : false);

    useEffect(() => {
        setNumFilas(datosJson ? datosJson.length : 0);
    }, [datosJson]);

    useEffect(() => {
        setSelecciones(Array(numFilas).fill(false));
        YaSeleccionadas();
    }, [numFilas]);

    function YaSeleccionadas() {
        if (Array.isArray(yaVienenSeleccionadas) && yaVienenSeleccionadas.length > 0) {
            if (Array.isArray(datosJson) && datosJson.length > 0) {
                console.log("entrando...");
                const auxSelecciones = new Array(datosJson.length).fill(false);
                const auxListaObj = [];
                yaVienenSeleccionadas.forEach((competencia, i) => {
                    datosJson.forEach((comp, j) => {
                        if (comp.id === competencia.id) {
                            auxSelecciones[j] = true;
                            auxListaObj.push(comp);
                        }
                    });
                });
                setSelecciones(auxSelecciones);
                setListaObjetosSelecc(auxListaObj);
            }
        }
    }

    const ManejarChecks = (index, objeto) => {
        //Primero se almacenan las selecciones
        const nuevasSelecciones = [...selecciones];
        nuevasSelecciones[index] = !nuevasSelecciones[index];
        const seleccNueva = nuevasSelecciones[index];
        setSelecciones(nuevasSelecciones);
        //Luego se almacenan los objetos seleccionados
        const objSeleccionados = [...listaObjetosSelecc];
        if (seleccNueva) {
            objSeleccionados.push(objeto);
            setListaObjetosSelecc(objSeleccionados);
        } else {
            //Se saca de la lista si se desmarca
            setListaObjetosSelecc(objSeleccionados.filter(obj => JSON.stringify(obj) !== JSON.stringify(objeto)));
        }
    }



    //almacenar la información de los index seleccionados en la lista para eliminarlos
    useEffect(() => {
        //le paso la lista a una prop que puede recibirse en un setState en el padre
        if (typeof listaSeleccProp === 'function') {
            //Paso las selecciones a la prop
            listaSeleccProp(listaObjetosSelecc);
        }
    }, [listaObjetosSelecc]);

    const SeleccionarTodo = (e) => {
        const valor = e.target.checked;
        setSelecciones(new Array(selecciones.length).fill(valor));
        //Se llena o vacía el array de ids para eliminación 
        if (valor) setListaObjetosSelecc(datosJson && datosJson);
        else setListaObjetosSelecc([]);
        //Se marca o desmarca la casilla de selecc todos
        setTodosSelecc(valor);
    }

    const PedirFuncionalidad = () => {
        alert("Agregar funcionalidad a este componente por favor...");
    }

    useEffect(() => {
        if (vaciarListaSelecc) {
            //limpio los selects por haber vaciado las selecciones
            const auxArray = selecciones.map(() => false);
            setSelecciones(auxArray);
        }
    }, [vaciarListaSelecc]);

    //Limpiar los objetos seleccionados al limpiar los select
    useEffect(() => {
        if (!selecciones.includes(true)) {
            setListaObjetosSelecc([]);
            setTodosSelecc(false);
        } else if (!selecciones.includes(false)) {
            setTodosSelecc(true);
        } else {
            setTodosSelecc(false);
        }
    }, [selecciones]);


    return (
        <table id='listaAvanzada'>
            <colgroup>
                <col style={{ width: 40 }}>
                </col>
            </colgroup>
            <thead>
                <tr className='tituloTabla'>
                    <th colSpan={`${numColumnas + 1}`}>{titulo}</th>
                </tr>
                <tr className='subtituloTabla'>

                    <td className='columnCheck'>
                        {
                            modoSeleccion ? null :
                                <input type='checkbox'
                                    onChange={SeleccionarTodo}
                                    checked={todosSelecc} />
                        }</td>
                    {
                        subtitulos ?
                            subtitulos.map((element) => (
                                <td key={element}>{element}</td>
                            ))
                            : <td>Se necesita lista subtítulos</td>
                    }
                </tr>
            </thead>
            <tbody>
                {
                    datosJson ?
                        datosJson.map((element, index) => (
                            <tr className='filaDatos' key={index}>
                                <td className='columnCheck'>
                                    {
                                        modoSeleccion ? null :
                                            <input type='checkbox'
                                                onChange={() => ManejarChecks(index, element)} checked={selecciones[index]}
                                                key={index} />
                                    }</td>
                                {
                                    Object.values(element).map((valor, index) => (
                                        <td onClick={clickFila ? () => clickFila(element) : PedirFuncionalidad}
                                            key={index} className='columnDato' title={valor}>
                                            {valor}
                                        </td>
                                    ))
                                }
                            </tr>
                        )) : null
                }
                {
                    /*Esta función mantiene un numero limitado de filas para que el tamaño
                de la tabla no varíe. Se calcula sabiendo que el alto de la tabla será 450px,
                el título tienen 40px, el subtítulo 36px y las filas 24px, por lo tanto
                (450-40-36)/24 da igual a 15.58 fila, que se redonde a 15 */
                    numFilas <= 15 ?
                        [...Array(15 - numFilas)].map((element, index) => (
                            <tr className='filaDatos' key={index}>
                                <td></td>
                                {
                                    [...Array(numColumnas)].map((element, index) => (
                                        <td key={index}></td>
                                    ))
                                }
                            </tr>
                        )) : null
                }
            </tbody>
        </table>
    );
}
export default ListaAvanzada;