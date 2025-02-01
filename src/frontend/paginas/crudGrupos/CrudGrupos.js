import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudGrupos.css';
import { listaMenuGrupos } from '../ListasMenuFiltro';
import ModalGrupos from '../../modales/modalGrupos/ModalGrupos';
import { mockGruposTres } from '../../mocks/MocksGrupos';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import ProgramaServicio from '../../../backend/repository/servicios/ProgramaService';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import JornadaServicio from '../../../backend/repository/servicios/JornadaService';
import TorreServicio from '../../../backend/repository/servicios/TorreService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SWALConfirm from '../../alertas/SWALConfirm';

const CrudGrupos = () => {

    const subs = ['Ficha', 'Programa académico', 'jornada',
        'trimestre']

    const navegar = useNavigate();

    const CargarLista = async () => {
        try {
            setListaObjetos(await new GrupoServicio().CargarLista());
        } catch (error) {
            Swal.fire(error);
            navegar(-1);
        }
    }

    const [grupoConsultado, setGrupoConsultado] = useState({});

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [listaFiltradaCadena, setListaFiltradaCadena] = useState([]);
    const [listaFiltradaNoCadena, setListaFiltradaNoCadena] = useState([]);
    const [listaAdaptada, setListaAdaptada] = useState([]);
    //los siguientes dos hooks son coodependendientes, opcionCadena depende donde este true en checkOpciones
    const [checkOpciones, setCheckOpciones] = useState([false, false, true]);
    const [opcionCadena, setOpcionCadena] = useState("ambos");

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
        //se actualizan las listas de cadena y no cadena cada que cambia la lista filtrada
        FiltrarCadenaFormacion();
    }, [listaFiltrada]);

    useEffect(() => {
        if (opcionCadena === "ambos") AdaptarLista(listaFiltrada);
        if (opcionCadena === "si") AdaptarLista(listaFiltradaCadena);
        if (opcionCadena === "no") AdaptarLista(listaFiltradaNoCadena);
    }, [listaFiltradaNoCadena]); //se elige esta variable ya que es la última en cambiar al FiltrarCadenaFormacion()

    const AdaptarLista = (listaRecibida) => {
        const listaAux = [];
        Array.isArray(listaFiltrada) &&
            listaRecibida.forEach((element) => {
                let objetoAux = {};
                objetoAux.id = element.id;
                objetoAux.nombrePrograma = element.nombrePrograma;
                objetoAux.jornada = element.jornada;
                objetoAux.trimestreLectivo = element.trimestreLectivo;
                listaAux.push(objetoAux);
            });
        setListaAdaptada(listaAux);
    }


    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

    //cada que cambia la seleccion de cadena de formación
    const manejarCambioRadios = (e) => {
        const texto = e.target.value;
        setOpcionCadena(texto);
    }

    //Función para definir checks en vista en función de la opción elegida y filtrar por Cadena Formacion
    useEffect(() => {
        let auxLista = [];
        if (opcionCadena === "si") {
            auxLista = [true, false, false];
            setCheckOpciones(auxLista);
        }
        if (opcionCadena === "no") {
            auxLista = [false, true, false];
            setCheckOpciones(auxLista);
        }
        if (opcionCadena === "ambos") {
            auxLista = [false, false, true];
            setCheckOpciones(auxLista);
        }
        FiltrarCadenaFormacion();
    }, [opcionCadena]);

    useEffect(() => {
        setListaVacia(listaSelecciones.length === 0);
    }, [listaSelecciones]);

    /********* SECCIÓN DE FILTRO Y BÚSQUEDA *************/
    const Filtrar = () => {
        setListaFiltrada(FiltroGeneral(seleccMenuFiltro, textoBusqueda, listaObjetos));
    }
    //cada vez que cambia el texto de búsqueda, con DEBOUNCE aplicado
    useEffect(() => {
        if (listaObjetos.length > 0) setTimeout(Filtrar, "50");
    }, [textoBusqueda]);

    const FiltrarCadenaFormacion = () => {
        const listaAuxCadena = [];
        const listaAuxNoCadena = []
        listaFiltrada.forEach((element) => {
            if (element.esCadenaFormacion) listaAuxCadena.push(element);
            else listaAuxNoCadena.push(element);
        });
        setListaFiltradaCadena(listaAuxCadena);
        setListaFiltradaNoCadena(listaAuxNoCadena);
    }
    /////////////////////////////////////////////////////

    /****************** SECCIÓN DE CONSULTA *************************/
    const [abrirConsulta, setAbrirConsulta] = useState(false);

    const AbrirConsulta = (e) => {
        DefinirGrupoConsultado(e.id);
        setAbrirConsulta(true);
    }

    const DefinirGrupoConsultado = (numFicha) => {
        let grupoAux = {};
        listaFiltrada.forEach((grupo) => {
            if (grupo.id === numFicha) grupoAux = grupo;
        });
        setGrupoConsultado(grupoAux);
    }
    /////////////////////////////////////////////////////

    /************  SECCIÓN DE REGISTRO ***************************/
    const [abrirRegistro, setAbrirRegistro] = useState(false);

    const AbrirRegistro = async () => {

        try {
            const VerificarProgramas = await new ProgramaServicio().ExisteUno() !== 0;
            const VerificarResponsables = await new InstructorServicio().ExisteUno() !== 0;
            const VerificarJornadas = await new JornadaServicio().ExisteUno() !== 0;

            if (!VerificarProgramas && !VerificarResponsables && !VerificarJornadas) {
                Swal.fire("Debes registrar al menos un programa académico, " +
                    "un instructor y una jornada para proceder");
            } else if (!VerificarProgramas && !VerificarResponsables && VerificarJornadas) {
                Swal.fire("Debes registrar al menos un programa académico y " +
                    "un instructor para proceder");
            } else if (!VerificarProgramas && VerificarResponsables && !VerificarJornadas) {
                Swal.fire("Debes registrar al menos un programa académico y " +
                    "una jornada para proceder");
            } else if (!VerificarProgramas && VerificarResponsables && VerificarJornadas) {
                Swal.fire("Debes registrar al menos un programa académico para proceder");
            } else if (VerificarProgramas && !VerificarResponsables && !VerificarJornadas) {
                Swal.fire("Debes registrar al menos un instructor y " +
                    "una jornada para proceder");
            } else if (VerificarProgramas && !VerificarResponsables && VerificarJornadas) {
                Swal.fire("Debes registrar al menos un instructor para proceder");
            } else if (VerificarProgramas && VerificarResponsables && !VerificarJornadas) {
                Swal.fire("Debes registrar al menos una jornada para proceder");
            } else {
                setAbrirRegistro(true);
            }
        } catch (error) {
            Swal.fire(error);
        }
    }
    /////////////////////////////////////////////////////

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
        setGrupoConsultado({});
        CargarLista();
    }

    const EliminarGrupos = async () => {
        const confirmar = await new SWALConfirm()
            .ConfirmAlert("¿Confirma que desea eliminar los grupos seleccionados?");
        if (confirmar === 'si') {
            try {
                const servicioGrupo = new GrupoServicio();
                const auxListaID = listaSelecciones.map(grupo => parseInt(grupo.id.toString()));
                const respuesta = await servicioGrupo.EliminarGrupo(auxListaID);
                Swal.fire(respuesta !== 0 ? ("Grupos eliminados satisfactoriamente!: ")
                    : ("No se eliminaron los grupos!"));
            } catch (error) {
                Swal.fire(error);
            }
            CargarLista();
        } else {
            return null;
        }
    }

    const onClicDestructivo = () => {
        EliminarGrupos();
        setVaciarListaSelecc(true);
    }

    const filtroExtra = <div id='contFiltroExtraGrupos'>
        <label htmlFor='esCadenaFormacion'>es cadena de formación: </label>
        <label className='opciones'>
            si <input type='radio' name='esCadenaFormacion' checked={checkOpciones[0]} value="si"
                onClick={manejarCambioRadios} />
        </label>
        <label className='opciones'>
            no <input type='radio' name='esCadenaFormacion' checked={checkOpciones[1]} value="no"
                onClick={manejarCambioRadios} />
        </label>
        <label className='opciones'>
            ambos <input type='radio' name='esCadenaFormacion' checked={checkOpciones[2]} value="ambos"
                onClick={manejarCambioRadios} />
        </label>
    </div>

    return (
        <div id='contCrudGrupos'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Grupos" seccLibre={filtroExtra}
                listaMenu={listaMenuGrupos} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)} onClicPositivo={AbrirRegistro}
                clicFila={AbrirConsulta} datosJson={listaAdaptada} subtitulos={subs}
                onCLicDestructivo={onClicDestructivo} vaciarListaSelecc={vaciarListaSelecc} />
            {
                abrirConsulta || abrirRegistro ?
                    <ModalGrupos abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} objConsulta={grupoConsultado} />
                    : null
            }
        </div>
    );
}
export default CrudGrupos;