import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import { datosJsonDos, datosJsonTres, datosJsonUno, listaMenuFiltro, tituloAux } from '../../mocks/mockCrudAvanzado';
import './CrudInstructores.css';

const CrudInstructores = () => {

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);

    useEffect(() => {
        setListaVacia(listaSelecciones.length === 0);
    }, [listaSelecciones]);

    return(
        <div id='contCrudInstruc'>
            <CrudAvanzado  listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} />
        </div>
    );
}
export default CrudInstructores;