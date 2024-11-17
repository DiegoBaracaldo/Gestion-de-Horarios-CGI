import React, { useEffect, useState } from 'react';
// import './ListaBasica.css';

function ListaBasica({ nameList, apiUrl}) {
    const [data, setData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const handleChange = () => {
        setIsChecked(!isChecked);
    };

    //consumo de apis
 useEffect(()=> {
    if(apiUrl) {
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error consultar datos:', error));
    }
 }, [apiUrl])
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>{nameList}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label>
                                <input
                                    type='checkbox'
                                    checked={isChecked}
                                    onChange={handleChange}
                                />
                            </label>
                        </td>
                        <td>
                        {data ? (
                             <pre>{JSON.stringify(data, null, 2)}</pre>
                                 ) : (
                                     <p>Loading...</p>
                                    )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ListaBasica;