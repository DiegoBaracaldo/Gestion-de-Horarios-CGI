import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import { datosJsonDos, datosJsonTres, datosJsonUno, listaMenuFiltro, tituloAux } from '../../mocks/mockCrudAvanzado';
import './CrudGrupos.css';
import { listaMenuGrupos } from '../ListasMenuFiltro';

const CrudGrupos = () => {

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);

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
                listaMenu={listaMenuGrupos}  filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)}/>
        </div>
    );
}
export default CrudGrupos;