import { useEffect, useState } from 'react';
import './ListaAvanzada.css';


const ListaAvanzada = ({ titulo, datosJson, clickFila }) => {

    //Valor de 10 por defecto como parche para cubrir el dinamismo de las columnas
    const [seleccionHook, setSeleccionHook] = useState("");
    const [numFilas, setNumFilas] = useState(datosJson ? datosJson.length : 0);
    const [numColumnas, setNumColumnas] = useState(datosJson ? Object.values(datosJson[0]).length : 0);
    /*Array que guarda los "checks" de las  filas de la tabla*/
    const [selecciones, setSelecciones] = useState(Array(numFilas).fill(false));

    useEffect(() => {
        setNumColumnas(datosJson ? Object.values(datosJson[0]).length : 0);
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

    const SeleccionarTodo = (e) => {
        setSelecciones(new Array(selecciones.length).fill(e.target.checked));
    }

    return (
        <table id='listaAvanzada'>
            <thead>
                <tr className='tituloTabla'>
                    <th colSpan={numColumnas + 1}>{titulo}</th>
                </tr>
                <tr className='subtituloTabla'>
                    <td className='columnCheck'><input type='checkbox'
                        onChange={SeleccionarTodo}></input></td>
                    {
                        Object.keys(datosJson[0]).map((element) => (
                            <td key={element}>{element}</td>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    datosJson.map((element, index) => (
                        <tr className='filaDatos' key={index}>
                            <td className='columnCheck'><input type='checkbox'
                                onChange={() => ManejarChecks(index)} checked={selecciones[index]}
                                ></input></td>
                            {
                                Object.values(element).map((valor) => (
                                    <td onClick={() => clickFila(element.nombre)}>{valor}</td>
                                ))
                            }
                        </tr>
                    ))
                }
                {
                    /*Esta función mantiene un numero limitado de filas para que el tamaño
                de la tabla no varíe. Se calcula sabiendo que el alto de la tabla será 450px,
                el título tienen 40px, el subtítulo 36px y las filas 24px, por lo tanto
                (450-40-36)/24 da igual a 15.58 fila, que se redonde a 15 */
                    numFilas <= 15 ?
                        [...Array(15 - numFilas)].map(() => (
                            <tr className='filaDatos'>
                                <td></td>
                                {
                                    [...Array(numColumnas)].map(() => (
                                        <td></td>
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