import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudAmbientes.css';
import { listaMenuAmbientes } from '../ListasMenuFiltro';
import ModalAmbientes from '../../modales/modalAmbientes/ModalAmbientes';
import { mockAmbientesTres } from '../../mocks/MocksAmbientes';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

const CrudAmbientes = () => {

    const subs = ['Ambiente', 'Torre', 'Capacidad de Estudiantes'];

    const CargarLista = () => {
        return new AmbienteServicio().CargarLista();
    }

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState(CargarLista);
    const [listaFiltrada, setListaFiltrada] = useState(listaObjetos);
    const [listaAdaptada, setListaAdaptada] = useState([]);

    //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
    useEffect(() => {
        const listaAux = [];
        listaFiltrada &&
            listaFiltrada.map((element) => {
                let objetoAux = {};
                objetoAux.nombre = element.nombre;
                objetoAux.nombreTorre = element.nombreTorre;
                objetoAux.capacidad = element.capacidad;
                listaAux.push(objetoAux);
            });
        setListaAdaptada(listaAux);
    }, [listaFiltrada]);

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

    // useEffect(() => {
    //     console.log(seleccMenuFiltro);
    // }, [seleccMenuFiltro]);

    useEffect(() => {
        setListaVacia(listaSelecciones.length === 0);
    }, [listaSelecciones]);

    /////////// SECCIÓN DE FILTRO Y BÚSQUEDA /////////////
    const Filtrar = () => {
        setListaFiltrada(FiltroGeneral(seleccMenuFiltro, textoBusqueda, listaObjetos));
    }
    //cada vez que cambia el texto de búsqueda, con DEBOUNCE aplicado
    useEffect(() => {
        setTimeout(Filtrar, "50");
    }, [textoBusqueda]);
    /////////////////////////////////////////////////////

    ///////// SECCIÓN DE CONSULTA ///////////////
    const [abrirConsulta, setAbrirConsulta] = useState(false);

    const AbrirConsulta = () => {
        setAbrirConsulta(true);
    }

    ///////// SECCIÓN DE REGISTRO ///////////////
    const [abrirRegistro, setAbrirRegistro] = useState(false);

    const AbrirRegistro = () => {
        VerificarTorres() ? setAbrirRegistro(true) :
            alert("Debes registrar al menos una torre para poder proceder");
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
        setListaFiltrada(CargarLista());
    }

    function VerificarTorres() {
        //aquí va el código para verificar que existan registros de torres
        return true;
    }

    return (
        <div id='contCrudAmbientes'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Ambientes"
                listaMenu={listaMenuAmbientes} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)}
                clicFila={AbrirConsulta} onClicPositivo={AbrirRegistro}
                datosJson={listaAdaptada} subtitulos={subs} />
            {
                abrirConsulta || abrirRegistro ?
                    <ModalAmbientes abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} /> :
                    null
            }
        </div>
    );
}
export default CrudAmbientes;