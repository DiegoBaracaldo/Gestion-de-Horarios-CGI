import React, { useEffect, useState } from 'react';
import './ListaBasica.css';

function ListaBasica({ nameList, apiUrl, datosJson, clic }) {
    const [data, setData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const numFilas = datosJson ? datosJson.length : 0;
    const [selecciones, setSelecciones] = useState(Array(numFilas).fill(false));

    // Maneja el cambio del checkbox en el encabezado
    const handleChange = () => {
        setIsChecked(!isChecked);
        const nuevasSelecciones = Array(numFilas).fill(!isChecked);
        setSelecciones(nuevasSelecciones);
    };

    // Maneja el cambio de los checkboxes individuales
    const ManejarChecks = (index) => {
        const nuevasSelecciones = [...selecciones];
        nuevasSelecciones[index] = !nuevasSelecciones[index];
        setSelecciones(nuevasSelecciones);

        // Verifica si todos los checkboxes están seleccionados o no
        const allChecked = nuevasSelecciones.every(val => val === true);
        setIsChecked(allChecked);
    };

    const ClickFila =() =>{
      clic && clic();
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

    return (
        <div id='listaBasicaContInterno'>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type='checkbox'
                                checked={isChecked}
                                onChange={handleChange}
                            />
                        </th>
                        <th>{nameList}</th>
                    </tr>
                </thead>
                <tbody>
                    {datosJson && datosJson.map((element, index) => (
                        <tr className='filaDatos' key={index} onClick={ClickFila}>
                            <td className='columnCheck'>
                                <input
                                    type='checkbox'
                                    onChange={() => ManejarChecks(index)}
                                    checked={selecciones[index]}
                                />
                            </td>
                            <td>
                                {element}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaBasica;
