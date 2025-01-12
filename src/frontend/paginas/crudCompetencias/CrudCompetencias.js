import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import { datosJsonDos, datosJsonTres, datosJsonUno, listaMenuFiltro, tituloAux } from '../../mocks/MockCrudAvanzado';
import './CrudCompetencias.css';
import { listaMenuCompetencias } from '../ListasMenuFiltro';
import ModalCompetencias from '../../modales/modalCompetencias/ModalCompetencias';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { mockCompetenciasTres } from '../../mocks/MocksCompetencias';
import CrudPrograma from '../crudProgramas/CrudPrograma';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SWALConfirm from '../../alertas/SWALConfirm';

const CrudCompetencias = ({ modoSeleccionMultiple, programaBusqueda, onCloseProp, selecciones,
    yaVienenSeleccionadas
 }) => {

    const subs = ['Código', 'Descripción Corta', 'Horas Semanales']

    const [competenciaConsultada, setCompetenciaConsultada] = useState({});

    const [nombrePrograma, setNombrePrograma] = useState('Seleccionar programa...');
    const [seleccPrograma, setSeleccPrograma] = useState(false);
    const [programa, setPrograma] = useState({});

    const navegar = useNavigate();

    useEffect(() => {
        if (Object.keys(programa).length > 0) {
            CargarLista();
            setEsconderBusqueda(false);
            setNombrePrograma(programa.nombre);
        } else {
            setEsconderBusqueda(true);
        }
    }, [programa]);

    const CargarLista = async () => {
        console.log("cargando lista...");
        try {
            setListaObjetos(await new CompetenciaServicio().CargarLista(programa.id));
        } catch (error) {
            Swal.fire(error);
            navegar(-1);
        }
    }

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [listaAdaptada, setListaAdaptada] = useState([]);
    const [esconderBusqueda, setEsconderBusqueda] = useState(true);
    const [btnAgregarOff, setBtnAgregarOff] = useState(true);

    useEffect(() => {
        if (modoSeleccionMultiple) {
            if (programaBusqueda && Object.keys(programaBusqueda).length > 0) {
                setEsconderBusqueda(true);
                setPrograma(programaBusqueda);
            }
        } else {
            CargarLista();
        }
    }, []);

    useEffect(() => {
        setListaFiltrada(listaObjetos);
    }, [listaObjetos]);


    //Para vaciar lista de selecciones al eliminar
    const [vaciarListaSelecc, setVaciarListaSelecc] = useState(false);

    //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
    useEffect(() => {
        const listaAux = [];
        Array.isArray(listaFiltrada) &&
            listaFiltrada.forEach((element) => {
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
        if (listaObjetos.length > 0) setTimeout(Filtrar, "50");
    }, [textoBusqueda]);
    /////////////////////////////////////////////////////

    //sección libre del crud
    const btnSeleccPrograma = !modoSeleccionMultiple ?
        <button className='btnSeleccPrograma' onClick={() => setSeleccPrograma(true)}>
            {nombrePrograma}
        </button>
        : <h1>Seleccione las competencias...</h1>

    ///////// SECCIÓN DE CONSULTA ///////////////
    const [abrirConsulta, setAbrirConsulta] = useState(false);

    const AbrirConsulta = (e) => {
        DefinirCompetConsultada(e.id);
        setAbrirConsulta(true);
    }

    const DefinirCompetConsultada = (idCompetencia) => {
        let compAux = {};
        listaFiltrada.forEach((competencia) => {
            if (competencia.id === idCompetencia) compAux = competencia;
        });
        setCompetenciaConsultada(compAux);
    }

    ///////// SECCIÓN DE REGISTRO ///////////////
    const [abrirRegistro, setAbrirRegistro] = useState(false);

    const AbrirRegistro = () => {
        if (!modoSeleccionMultiple) setAbrirRegistro(true);
        else {
            if (typeof selecciones === 'function' && typeof onCloseProp === 'function') {
                selecciones(listaSelecciones);
                onCloseProp();
            }
        }
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
        setCompetenciaConsultada({});
        CargarLista();
    }

    async function EliminarCompetencias() {
        const confirmar = await new SWALConfirm()
            .ConfirmAlert("¿Confirma que desea eliminar los competencias seleccionados?");
        if (confirmar) {
            try {
                const servicioCompetencia = new CompetenciaServicio();
                const auxListaID = listaSelecciones.map(competencia => parseInt(competencia.id.toString()));
                const respuesta = await servicioCompetencia.EliminarCompetencia(auxListaID);
                Swal.fire(respuesta !== 0 ? ("Competencias eliminadas satisfactoriamente!: ")
                    : ("Error al eliminar las competencias!"));
            } catch (error) {
                Swal.fire(error);
            }
            CargarLista();
        } else {
            return null;
        }
    }

    const OnClicDestructivo = () => {
        if (modoSeleccionMultiple) {
            if (typeof onCloseProp === 'function') onCloseProp();
            else return null;
        } else {
            EliminarCompetencias();
            setVaciarListaSelecc(true);
        }
    }

    return (
        <div id='contCrudCompetencias'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={!modoSeleccionMultiple ? listaVacia : false}
                titulo="Competencias"
                listaMenu={listaMenuCompetencias} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)}
                esconderBusqueda={!modoSeleccionMultiple ? esconderBusqueda : true}
                seccLibre={btnSeleccPrograma}
                disabledPositivo={!modoSeleccionMultiple ? btnAgregarOff : listaVacia}
                onClicPositivo={AbrirRegistro}
                clicFila={AbrirConsulta}
                datosJson={!modoSeleccionMultiple ? (esconderBusqueda ? null : listaAdaptada) : listaAdaptada}
                subtitulos={subs}
                onCLicDestructivo={OnClicDestructivo} vaciarListaSelecc={vaciarListaSelecc}
                modoSeleccMultiple={modoSeleccionMultiple} 
                yaVienenSeleccionadas={yaVienenSeleccionadas}/>
            {
                abrirRegistro || abrirConsulta ?
                    <ModalCompetencias abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} programa={programa}
                        objConsulta={competenciaConsultada} modoSeleccMultiple={modoSeleccionMultiple}/>
                    : null
            }
            {
                seleccPrograma ? <CrudPrograma modoSeleccion={true}
                    onClose={() => setSeleccPrograma(false)}
                    programaSeleccionado={(p) => setPrograma(p)} />
                    : null
            }
        </div>
    );
}
export default CrudCompetencias;