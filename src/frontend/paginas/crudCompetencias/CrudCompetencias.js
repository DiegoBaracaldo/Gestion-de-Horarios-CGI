import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import { datosJsonDos, datosJsonTres, datosJsonUno, listaMenuFiltro, tituloAux } from '../../mocks/MockCrudAvanzado';
import './CrudCompetencias.css';
import { listaMenuAmbientes, listaMenuCompetencias } from '../ListasMenuFiltro';
import ModalCompetencias from '../../modales/modalCompetencias/ModalCompetencias';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { mockCompetenciasTres } from '../../mocks/MocksCompetencias';

const CrudCompetencias = () => {

    const subs = ['Código', 'Descripción Corta', 'Horas Semanales']

    const CargarLista = () => {
        return new CompetenciaServicio().CargarLista();
    }

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState(CargarLista);
    const [listaFiltrada, setListaFiltrada] = useState(listaObjetos);
    const [listaAdaptada, setListaAdaptada] = useState([]);
    const [esconderBusqueda, setEsconderBusqueda] = useState(true);
    const [btnAgregarOff, setBtnAgregarOff] = useState(true);

    //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
    useEffect(() => {
        const listaAux = [];
        listaFiltrada &&
            listaFiltrada.map((element) => {
                let objetoAux = {};
                objetoAux.id = element.id;
                objetoAux.descripcion = element.descripcion;
                objetoAux.horasRequeridas = element.horasRequeridas;
                listaAux.push(objetoAux);
            });
        setListaAdaptada(listaAux);
    }, [listaFiltrada]);

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

    /////////// SECCIÓN DE FILTRO Y BÚSQUEDA /////////////
    const Filtrar = () => {
        setListaFiltrada(FiltroGeneral(seleccMenuFiltro, textoBusqueda, listaObjetos));
    }
    //cada vez que cambia el texto de búsqueda, con DEBOUNCE aplicado
    useEffect(() => {
        setTimeout(Filtrar, "50");
    }, [textoBusqueda]);
    /////////////////////////////////////////////////////

    //sección libre del crud
    const btnSeleccPrograma = <button className='btnSeleccPrograma' onClick={LogicaSeleccPrograma}>
        Seleccionar programa...
    </button>

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
        <div id='contCrudCompetencias'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Competencias"
                listaMenu={listaMenuCompetencias} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)} esconderBusqueda={esconderBusqueda}
                seccLibre={btnSeleccPrograma} disabledPositivo={btnAgregarOff} onClicPositivo={AbrirRegistro}
                clicFila={AbrirConsulta} datosJson={esconderBusqueda ? null : listaAdaptada}
                subtitulos={subs} />
            {
                abrirRegistro || abrirConsulta ?
                    <ModalCompetencias abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} /> :
                    null
            }
        </div>
    );
}
export default CrudCompetencias;