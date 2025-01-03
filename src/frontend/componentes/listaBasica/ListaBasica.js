import React, { useEffect, useState } from 'react';
import './ListaBasica.css';

function ListaBasica({ nameList, apiUrl, datosJson, clic, listaSeleccProp, modoSeleccion, vaciarChecks }) {
    const [data, setData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [numFilas, setNumFilas] = useState(0);
    const [selecciones, setSelecciones] = useState([]);

    useEffect(() => {
        if (vaciarChecks) {
            setIsChecked(false);
        }
    }, [vaciarChecks]);

    useEffect(() => {
        SeleccsMultiples(isChecked);
    }, [isChecked]);

    useEffect(() => {
        setNumFilas(datosJson ? datosJson.length : 0);
    }, [datosJson]);

    useEffect(() => {
        setSelecciones(Array(numFilas).fill(false));
    }, [numFilas]);

    // Maneja el cambio del checkbox en el encabezado
    const handleChange = () => {
        setIsChecked(!isChecked);
    };

    //Modificar selects a partir de manejar selección de todos
    function SeleccsMultiples(valor) {
        const nuevasSelecciones = Array(numFilas).fill(valor);
        setSelecciones(nuevasSelecciones);
    }

    // Maneja el cambio de los checkboxes individuales
    const ManejarChecks = (index) => {
        const nuevasSelecciones = [...selecciones];
        nuevasSelecciones[index] = !nuevasSelecciones[index];
        setSelecciones(nuevasSelecciones);

        //const allChecked = nuevasSelecciones.every(val => val === true);
        //setIsChecked(allChecked);
    };

    const ClickFila = (e) => {
        clic && clic(e);
    }

    // Consumo de APIs
    useEffect(() => {
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setData(data))
                .catch(error => console.error('Error al consultar datos:', error));
        }
    }, [apiUrl]);

    //selecciones
    useEffect(() => {
        const arraySelecciones = [];
        selecciones.forEach((element, index) => {
            element && arraySelecciones.push(datosJson[index]);
        });
        //le paso la lista a una prop que puede recibirse en un setState en el padre
        listaSeleccProp && listaSeleccProp(arraySelecciones);
    }, [selecciones]);
    return (
        <div id='listaBasicaContInterno'>
            <table>
                <thead>
                    <tr>
                        <th>
                            {
                                !modoSeleccion && <input
                                    type='checkbox'
                                    checked={isChecked}
                                    onChange={handleChange}
                                />
                            }
                        </th>
                        <th>{nameList}</th>
                    </tr>
                </thead>
                <tbody>
                    {datosJson && datosJson.map((element, index) => (
                        <tr className='filaDatos' key={index} onClick={() => ClickFila(element)}>
                            <td className='columnCheck'
                                onClick={(event) => event.stopPropagation()} >
                                {
                                    !modoSeleccion && <input
                                        type='checkbox'
                                        onChange={() => ManejarChecks(index)}
                                        checked={selecciones[index]}
                                    />
                                }
                            </td>
                            <td>
                                {element.nombre || element.tipo}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaBasica;
