import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import { datosJsonDos, datosJsonTres, datosJsonUno, listaMenuFiltro, tituloAux } from '../../mocks/mockCrudAvanzado';
import './CrudCompetencias.css';
import { listaMenuAmbientes, listaMenuCompetencias } from '../ListasMenuFiltro';

const CrudCompetencias = () => {

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [esconderBusqueda, setEsconderBusqueda] = useState(true);
    const [btnAgregarOff, setBtnAgregarOff] = useState(true);

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

    ////////////////////////////////////////////////
    //aquí va la lógica al seleccionar un programa
    const LogicaSeleccPrograma = () => {
        setEsconderBusqueda(!esconderBusqueda);
    }
    ////////////////////////////////////////////////

    useEffect(() => {
        setBtnAgregarOff(esconderBusqueda);
    }, [esconderBusqueda]);

    useEffect(() => {
        setListaVacia(listaSelecciones.length === 0);
    }, [listaSelecciones]);

    //sección libre del crud
    const btnSeleccPrograma = <button className='btnSeleccPrograma' onClick={LogicaSeleccPrograma}>
        Seleccionar programa...
    </button>

    return (
        <div id='contCrudCompetencias'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Competencias"
                listaMenu={listaMenuCompetencias} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)} esconderBusqueda={esconderBusqueda}
                seccLibre={btnSeleccPrograma} disabledPositivo={btnAgregarOff} />
        </div>
    );
}
export default CrudCompetencias;