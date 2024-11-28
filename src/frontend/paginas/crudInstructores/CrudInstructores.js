import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudInstructores.css';
import { listaMenuIntruct } from '../ListasMenuFiltro';
import ModalInstructores from '../../modales/modalInstructores/ModalInstructores';
import { mockInstructoresTres } from '../../mocks/MocksInstructores';

const CrudInstructores = () => {

    const subs = ['identificación', 'nombre completo', 'especialidad', 'tope horas'];

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

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
        <div id='contCrudInstruc'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Instructores"
                listaMenu={listaMenuIntruct} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)} onClicPositivo={AbrirRegistro}
                clicFila={AbrirConsulta}  datosJson={mockInstructoresTres}
                subtitulos={subs}/>
            {
                abrirConsulta || abrirRegistro ?
                    <ModalInstructores abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} /> :
                    null
            }
        </div>
    );
}
export default CrudInstructores;