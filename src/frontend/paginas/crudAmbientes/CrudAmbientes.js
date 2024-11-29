import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import './CrudAmbientes.css';
import { listaMenuAmbientes } from '../ListasMenuFiltro';
import ModalAmbientes from '../../modales/modalAmbientes/ModalAmbientes';
import { mockAmbientesTres } from '../../mocks/MocksAmbientes';

const CrudAmbientes = () => {

    const subs = ['Ambiente', 'Torre', 'Capacidad de Estudiantes'];

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

    // useEffect(() => {
    //     console.log(seleccMenuFiltro);
    // }, [seleccMenuFiltro]);

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
        VerificarTorres() ? setAbrirRegistro(true) :
            alert("Debes registrar al menos una torre para poder proceder");
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
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
                datosJson={mockAmbientesTres} subtitulos={subs}/>
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