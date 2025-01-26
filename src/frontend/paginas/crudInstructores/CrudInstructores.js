import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudInstructores.css';
import { listaMenuIntruct } from '../ListasMenuFiltro';
import ModalInstructores from '../../modales/modalInstructores/ModalInstructores';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { mockInstructoresTres } from '../../mocks/MocksInstructores';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SWALConfirm from '../../alertas/SWALConfirm';

const CrudInstructores = ({ modoSeleccion, onClose, responsableSeleccionado, franjasDeseadas }) => {

    const subs = modoSeleccion ?
        ['identificación', 'nombre completo', 'especialidad', 'tope horas', 'grupos a cargo']
        : ['identificación', 'nombre completo', 'especialidad', 'tope horas'];

    const navegar = useNavigate();

    const CargarLista = async () => {
        //// si es que viene de edición de horario, es decir, si es un array
        console.log("cargando lista...");
        try {
            let respuesta = await new InstructorServicio().CargarLista();
            respuesta = respuesta.map(instr => (
                {
                    ...instr,
                    franjaDisponibilidad: DeserealizarDisponibilidad(instr.franjaDisponibilidad),
                    listaOcupancia:
                        instr.listaOcupancia === null ? [] : DeserealizarDisponibilidad(instr.listaOcupancia)
                }
            ));
            //La variable franjasdDeseadas se usa  para  filtrar la lista por su disponibilidad
            //// y por su cantidad horas en listaOcupancia
            if (Array.isArray(franjasDeseadas) && franjasDeseadas.length > 0 ) {
                respuesta = respuesta.filter(instr =>
                    franjasDeseadas.every(franja =>
                        instr.franjaDisponibilidad.includes(franja) &&
                        franjasDeseadas.length <= instr.franjaDisponibilidad.length - instr.listaOcupancia.length)
                );
            }
            console.log(respuesta);
            setListaObjetos(respuesta);

        } catch (error) {
            Swal.fire(error);
            navegar(-1);
        }
    }

    function DeserealizarDisponibilidad(texto) {
        return texto.split(',').map(item => Number(item.trim())) || [];
    }

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [listaAdaptada, setListaAdaptada] = useState([]);

    const [instructorConsultado, setInstructorConsultado] = useState({});

    //Para vaciar lista de selecciones al eliminar
    const [vaciarListaSelecc, setVaciarListaSelecc] = useState(false);

    //Variable para indicar la cantidad de horas asignadas de un instructor
    const [horasAsignadas, setHorasAsignadas] = useState(0);

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
                objetoAux.especialidad = element.especialidad;
                objetoAux.topeHoras = `${element.listaOcupancia.length /2} / ${element.topeHoras}`;
                if (modoSeleccion) objetoAux.cantidadGruposACargo = element.cantidadGruposACargo;
                listaAux.push(objetoAux);
            });
        setListaAdaptada(listaAux);
        setHorasAsignadas(() => {
            //Espacio para enviar la cantidad de horas asignadas a la lista CRUD
            return 10;
        });
    }, [listaFiltrada]);

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

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


    ///////// SECCIÓN DE CONSULTA ///////////////
    const [abrirConsulta, setAbrirConsulta] = useState(false);

    const AbrirConsulta = () => {
        setAbrirConsulta(true);
    }
    /////////////////////////////////////////////////////

    ///////// SECCIÓN DE REGISTRO ///////////////
    const [abrirRegistro, setAbrirRegistro] = useState(false);

    const AbrirRegistro = () => {
        setAbrirRegistro(true);
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
        setInstructorConsultado({});
        CargarLista();
    }
    /////////////////////////////////////////////////////

    const OnClickDestructivo = () => {
        if (modoSeleccion) {
            onClose && onClose();
        } else {
            EliminarInstructores();
            setVaciarListaSelecc(true);
        }
    }

    const OnClickFila = (r) => {
        if (modoSeleccion) {
            responsableSeleccionado && responsableSeleccionado(r);
            onClose();
        } else {
            DefinirInstructorConsultado(r.id);
            AbrirConsulta();
        }
    }

    const DefinirInstructorConsultado = (idInstructor) => {
        const instructor = listaFiltrada.find(i => i.id === idInstructor);
        setInstructorConsultado(instructor);
    }

    const EliminarInstructores = async () => {
        const confirmar = await new SWALConfirm()
            .ConfirmAlert("¿Confirma que desea eliminar los instructores seleccionados?");
        if (confirmar) {
            try {
                const servicioInstructor = new InstructorServicio();
                const auxListaID = listaSelecciones.map(instruc => parseInt(instruc.id.toString()));
                const respuesta = await servicioInstructor.EliminarInstructor(auxListaID);
                Swal.fire(respuesta !== 0 ? ("Instructores eliminados satisfactoriamente!: ")
                    : ("NO se eliminaron los instructores!"));
            } catch (error) {
                Swal.fire(error);
            }
            CargarLista();
        } else {
            return null;
        }
    }

    return (
        <div id='contCrudInstruc' style={modoSeleccion && { zIndex: '10' }}>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Instructores"
                listaMenu={listaMenuIntruct} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)} onClicPositivo={AbrirRegistro}
                clicFila={r => OnClickFila(r)} datosJson={listaAdaptada}
                subtitulos={subs} modoSeleccion={modoSeleccion}
                onCLicDestructivo={OnClickDestructivo} vaciarListaSelecc={vaciarListaSelecc} />
            {
                abrirConsulta || abrirRegistro ?
                    <ModalInstructores abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} objConsultado={instructorConsultado} /> :
                    null
            }
        </div>
    );
}
export default CrudInstructores;