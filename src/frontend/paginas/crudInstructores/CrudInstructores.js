import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudInstructores.css';
import { listaMenuIntruct } from '../ListasMenuFiltro';
import ModalInstructores from '../../modales/modalInstructores/ModalInstructores';
import InstructorServicio from '../../../backend/repository/servicios/InstructorService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { mockInstructoresTres } from '../../mocks/MocksInstructores';

const CrudInstructores = ({modoSeleccion, onClose, responsableSeleccionado}) => {

    const subs = ['identificación', 'nombre completo', 'especialidad', 'tope horas'];

    const CargarLista = async () => {
        console.log("cargando lista...");
        try {
          setListaObjetos(await new InstructorServicio().CargarLista());
        } catch (error) {
          console.log("error en crud instructores por: ", error);
          setListaObjetos([]);
        }
    }

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [listaAdaptada, setListaAdaptada] = useState([]);

    const [instructorConsultado, setInstructorConsultado] = useState({});

    useEffect(() => {
        CargarLista();
    },[]);

    useEffect(() => {
        setListaFiltrada(listaObjetos);
    },[listaObjetos]);

    //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
    useEffect(() => {
        const listaAux = [];
        listaFiltrada &&
            listaFiltrada.forEach((element) => {
                let objetoAux = {};
                objetoAux.id = element.id;
                objetoAux.nombre = element.nombre;
                objetoAux.especialidad = element.especialidad;
                objetoAux.topeHoras = element.topeHoras;
                listaAux.push(objetoAux);
            });
        setListaAdaptada(listaAux);
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
        if(listaObjetos.length > 0)setTimeout(Filtrar, "50");
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

    const OnClickDestructivo =  () => {
        if(modoSeleccion){
            onClose && onClose();
        }else{
            EliminarInstructores();
        }
    }

    const OnClickFila = (r) => {
        if(modoSeleccion){
            responsableSeleccionado && responsableSeleccionado(r);
            onClose();
        }else{
            DefinirInstructorConsultado(r.id);
            AbrirConsulta();
        }
    }

    const DefinirInstructorConsultado = (idInstructor) => {
        const instructor = listaFiltrada.find(i => i.id === idInstructor);
        setInstructorConsultado(instructor);
    }

    const EliminarInstructores = async () => {
        const confirmar = window.confirm("¿Confirma que desea eliminar los instructores seleccionados?");
        if (confirmar) {
          const servicioInstructor = new InstructorServicio();
          const auxListaID = listaSelecciones.map(instruc => parseInt(instruc.id.toString()));
          const respuesta = await servicioInstructor.EliminarInstructor(auxListaID);
          alert(respuesta !== 0 ? ("Programas eliminados satisfactoriamente!: ")
            : ("Error al eliminar los programas!"));
          CargarLista();
        } else {
          return null;
        }
    }

    return (
        <div id='contCrudInstruc' style={modoSeleccion && {zIndex: '10'}}>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Instructores"
                listaMenu={listaMenuIntruct} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)} onClicPositivo={AbrirRegistro}
                clicFila={r => OnClickFila(r)} datosJson={listaAdaptada}
                subtitulos={subs} modoSeleccion={modoSeleccion}
                onCLicDestructivo={OnClickDestructivo}/>
            {
                abrirConsulta || abrirRegistro ?
                    <ModalInstructores abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} objConsultado={instructorConsultado}/> :
                    null
            }
        </div>
    );
}
export default CrudInstructores;