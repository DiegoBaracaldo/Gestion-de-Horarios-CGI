import { useEffect, useState } from 'react';
import './ListaAvanzada.css';


const ListaAvanzada = ({ titulo, subtitulos, datosJson, clickFila, listaSeleccProp,
    modoSeleccion
}) => {

    //Valor de 10 por defecto como parche para cubrir el dinamismo de las columnas
    const [numFilas, setNumFilas] = useState(datosJson ? datosJson.length : 0);
    const [numColumnas, setNumColumnas] = useState(subtitulos ? subtitulos.length : 1);
    /*Array que guarda los "checks" de las  filas de la tabla*/
    const [selecciones, setSelecciones] = useState(Array(numFilas).fill(false));

    useEffect(() => {
        setNumFilas(datosJson ? datosJson.length : 0);
    }, [datosJson]);

    useEffect(() => {
        setSelecciones(Array(numFilas).fill(false));
    }, [numFilas]);

    const ManejarChecks = (index) => {
        const nuevasSelecciones = [...selecciones];
        nuevasSelecciones[index] = !nuevasSelecciones[index];
        setSelecciones(nuevasSelecciones);
    }
    //almacenar la información de los index seleccionados en la lista para eliminarlos
    useEffect(() => {
        const arraySelecciones = [];
        selecciones.forEach((element, index) => {
            element && arraySelecciones.push(index);
        });
        //le paso la lista a una prop que puede recibirse en un setState en el padre
        listaSeleccProp && listaSeleccProp(arraySelecciones);
    }, [selecciones]);

    const SeleccionarTodo = (e) => {
        setSelecciones(new Array(selecciones.length).fill(e.target.checked));
    }

    const PedirFuncionalidad = () => {
        alert("Agregar funcionalidad a este componente por favor...");
    }

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
                                    onChange={SeleccionarTodo} />
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
                                                onChange={() => ManejarChecks(index)} checked={selecciones[index]}
                                                key={index} />
                                    }</td>
                                {
                                    Object.values(element).map((valor, index) => (
                                        <td onClick={clickFila ? () => clickFila(element) : PedirFuncionalidad}
                                            key={index}>{valor}</td>
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