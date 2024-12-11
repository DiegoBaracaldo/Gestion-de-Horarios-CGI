import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudGrupos.css';
import { listaMenuGrupos } from '../ListasMenuFiltro';
import ModalGrupos from '../../modales/modalGrupos/ModalGrupos';
import { mockGruposTres } from '../../mocks/MocksGrupos';
import GrupoServicio from '../../../backend/repository/servicios/GrupoService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';

const CrudGrupos = () => {

    const subs = ['Ficha', 'Código de grupo', 'Programa académico', 'jornada']

    const CargarLista = () => {
        return new GrupoServicio().CargarLista();
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
                objetoAux.id = element.id;
                objetoAux.codigoGrupo = element.codigoGrupo;
                objetoAux.nombrePrograma = element.nombrePrograma;
                objetoAux.jornada = element.jornada;
                listaAux.push(objetoAux);
            });
        setListaAdaptada(listaAux);
    }, [listaFiltrada]);

    //los siguientes dos hooks son coodependendientes, opcionCadena depende donde este true en checkOpciones
    const [checkOpciones, setCheckOpciones] = useState([false, false, true]);
    const [opcionCadena, setOpcionCadena] = useState("ambos");

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

    //cada que cambia la seleccion de cadena de formación
    const manejarCambioRadios = (e) => {
        const texto = e.target.value;
        setOpcionCadena(texto);
    }

    //Función para definir checks en vista en función de la opción elegida
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
    }, [opcionCadena]);

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
        if (!VerificarProgramas() && !VerificarResponsables() && !VerificarJornadas()) {
            alert("Debes registrar al menos un programa académico, " +
                "un instructor y una jornada para proceder");
        } else if (!VerificarProgramas() && !VerificarResponsables() && VerificarJornadas()) {
            alert("Debes registrar al menos un programa académico y " +
                "un instructor para proceder");
        } else if (!VerificarProgramas() && VerificarResponsables() && !VerificarJornadas()) {
            alert("Debes registrar al menos un programa académico y " +
                "una jornada para proceder");
        } else if (!VerificarProgramas() && VerificarResponsables() && VerificarJornadas()) {
            alert("Debes registrar al menos un programa académico para proceder");
        } else if (VerificarProgramas() && !VerificarResponsables() && !VerificarJornadas()) {
            alert("Debes registrar al menos un instructor y " +
                "una jornada para proceder");
        } else if (VerificarProgramas() && !VerificarResponsables() && VerificarJornadas()) {
            alert("Debes registrar al menos un instructor para proceder");
        } else if (VerificarProgramas() && VerificarResponsables() && !VerificarJornadas()) {
            alert("Debes registrar al menos una jornada para proceder");
        } else {
            setAbrirRegistro(true);
        }
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
    }

    function VerificarProgramas() {
        //código para verificar que exista al menos un programa académico en la BD
        return true;
    }
    function VerificarResponsables() {
        //código para verificar que exista al menos un instructor en la BD
        return true;
    }
    function VerificarJornadas() {
        //código para verificar que exista al menos una jornada académico en la BD
        return true;
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
                clicFila={AbrirConsulta} datosJson={listaAdaptada} subtitulos={subs} />
            {
                abrirConsulta || abrirRegistro ?
                    <ModalGrupos abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} /> :
                    null
            }
        </div>
    );
}
export default CrudGrupos;