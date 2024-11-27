import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import { datosJsonDos, datosJsonTres, datosJsonUno, listaMenuFiltro, tituloAux } from '../../mocks/mockCrudAvanzado';
import './CrudAmbientes.css';
import { listaMenuAmbientes } from '../ListasMenuFiltro';
import ModalAmbientes from '../../modales/modalAmbientes/ModalAmbientes';

const CrudAmbientes = () => {

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

    // useEffect(() => {
    //     console.log(seleccMenuFiltro);
    // }, [seleccMenuFiltro]);

    useEffect(() => {
        setListaVacia(listaSelecciones.length === 0);
    }, [listaSelecciones]);

    ///////// SECCIÓN DE CONSULTA ///////////////
    const [abrirConsulta, setAbrirConsulta] = useState(false);

    const AbrirConsulta = () => {
        setAbrirConsulta(true);
    }

    ///////// SECCIÓN DE REGISTRO ///////////////
    const [abrirRegistro, setAbrirRegistro] = useState(false);

    const AbrirRegistro = () => {
        setAbrirRegistro(true);
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
    }

    return (
        <div id='contCrudAmbientes'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Ambientes"
                listaMenu={listaMenuAmbientes} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)}
                clicFila={AbrirConsulta} onClicPositivo={AbrirRegistro} />
            <ModalAmbientes abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                onCloseProp={() => CerrarModal()} />
        </div>
    );
}
export default CrudAmbientes;