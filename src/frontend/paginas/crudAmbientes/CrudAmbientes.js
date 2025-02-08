import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudAmbientes.css';
import { listaMenuAmbientes } from '../ListasMenuFiltro';
import ModalAmbientes from '../../modales/modalAmbientes/ModalAmbientes';
import AmbienteServicio from '../../../backend/repository/servicios/AmbienteService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SWALConfirm from '../../alertas/SWALConfirm';

const CrudAmbientes = ({
    onClose,
    modoSeleccion,
    ambienteSelecc,
    franjasDeseadas,
    listaCompletaGrupos }) => {

    const subs = ['id', 'Ambiente', 'Torre', 'Capacidad de Estudiantes'];
    const navegar = useNavigate();

    const CargarLista = async () => {
        console.log("cargando lista...");
        try {
            let respuesta = await new AmbienteServicio().CargarLista();
            respuesta = respuesta.map(ambiente => (
                {
                    ...ambiente,
                    franjaDisponibilidad: DeserealizarDisponibilidad(ambiente.franjaDisponibilidad),
                    listaOcupancia: AnalizarListaOcupancia(ambiente.id)
                }
            ));
            if (Array.isArray(franjasDeseadas) && franjasDeseadas.length > 0) {
                respuesta = respuesta.filter(ambiente =>
                    franjasDeseadas.every(franja => ambiente.franjaDisponibilidad.includes(franja)
                        && !ambiente.listaOcupancia.includes(franja))
                );
            }
            setListaObjetos(respuesta);
        } catch (error) {
            Swal.fire(error);
            navegar(-1);
        }
    }

    function AnalizarListaOcupancia(idAmbiente){
        const listaAux = [];
        listaCompletaGrupos?.forEach(programa => {
            programa.grupos.forEach(grupo => {
                grupo.franjasPersonalizadas.forEach((franja, index) => {
                    if(franja){
                        if(franja?.ambiente.id === idAmbiente) listaAux.push(index);
                    }
                });
            });
        });
        // console.log(listaAux);
        return listaAux;
    }

    function DeserealizarDisponibilidad(texto) {
        return texto.split(',').map(item => Number(item.trim())) || [];
    }

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [listaAdaptada, setListaAdaptada] = useState([]);

    const [ambienteConsultado, setAmbienteConsultado] = useState({});

    //Para vaciar lista de selecciones al eliminar
    const [vaciarListaSelecc, setVaciarListaSelecc] = useState(false);

    useEffect(() => {
        CargarLista();
    }, []);

    useEffect(() => {
        setListaFiltrada(listaObjetos);
    }, [listaObjetos]);

    //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
    useEffect(() => {
        const listaAux = [];
        Array.isArray(listaFiltrada) &&
            listaFiltrada.forEach((element) => {
                let objetoAux = {};
                objetoAux.id = element.id;
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
        if (listaObjetos.length > 0) setTimeout(Filtrar, "50");
    }, [textoBusqueda]);
    //////////////////////////////////////////////////////

    ///////// SECCIÓN DE CONSULTA ///////////////
    const [abrirConsulta, setAbrirConsulta] = useState(false);

    const AbrirConsulta = (e) => {
        DefinirAmbienteConsulta(e.nombre, e.nombreTorre);
    }

    const DefinirAmbienteConsulta = (nombreAmbiente, nombreTorre) => {
        const ambiente = listaFiltrada.find((element) =>
            element.nombre === nombreAmbiente && element.nombreTorre === nombreTorre);
        setAmbienteConsultado(ambiente);
    }

    useEffect(() => {
        if (Object.keys(ambienteConsultado).length > 0) {
            if (!modoSeleccion) {
                setAbrirConsulta(true);
            } else {
                if (typeof ambienteSelecc === 'function') ambienteSelecc(ambienteConsultado);
                if (typeof onClose === 'function') onClose();
            }
        }
    }, [ambienteConsultado]);

    ///////// SECCIÓN DE REGISTRO ///////////////
    const [abrirRegistro, setAbrirRegistro] = useState(false);

    const AbrirRegistro = () => {
        VerificarTorres() ? setAbrirRegistro(true) :
            Swal.fire("Debes registrar al menos una torre para poder proceder");
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
        setAmbienteConsultado({});
        CargarLista();
    }

    async function VerificarTorres() {
        const respuesta = await new TorreServicio().ExisteUno();
        return respuesta !== 0 ? true : false;
    }

    const EliminarAmbientes = async () => {
        const confirmar = await new SWALConfirm()
            .ConfirmAlert("¿Confirma que desea eliminar los ambientes seleccionados?");
        if (confirmar === 'si') {
            try {
                const servicioAmbiente = new AmbienteServicio();
                const auxListaID = listaSelecciones.map(ambiente => parseInt(ambiente.id.toString()));
                const respuesta = await servicioAmbiente.EliminarAmbiente(auxListaID);
                console.log(respuesta);
                Swal.fire(respuesta !== 0 ? ("Ambientes eliminados satisfactoriamente!")
                    : ("Los ambientes no se eliminaron!"));
            } catch (error) {
                Swal.fire(error);
            }
            CargarLista();
        } else {
            return null;
        }
    }

    const OnClicDestructivo = () => {
        EliminarAmbientes();
        setVaciarListaSelecc(true);
    }

    useEffect(() => {
        if (vaciarListaSelecc) setVaciarListaSelecc(false);
    }, [vaciarListaSelecc]);

    const ManejarClicFila = (e) => {
        AbrirConsulta(e);
    }

    return (
        <div id='contCrudAmbientes' style={modoSeleccion && { zIndex: '10' }}>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia}
                titulo="Ambientes"
                listaMenu={listaMenuAmbientes}
                filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)}
                clicFila={e => ManejarClicFila(e)}
                onClicPositivo={AbrirRegistro}
                datosJson={listaAdaptada} subtitulos={subs}
                onCLicDestructivo={modoSeleccion ? () => onClose() : OnClicDestructivo}
                vaciarListaSelecc={vaciarListaSelecc}
                modoSeleccion={modoSeleccion} />
            {
                abrirConsulta || abrirRegistro ?
                    <ModalAmbientes abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} objConsulta={ambienteConsultado} /> :
                    null
            }
        </div>
    );
}
export default CrudAmbientes;