import ListaAvanzada from '../listaAvanzada/ListaAvanzada';
import './CrudAvanzado.css';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonVolver from '../botonVolver/BotonVolver';
import { useEffect, useState } from 'react';

const CrudAvanzado = ({ seccLibre, listaMenu, filtrarPor, buscarPor, datosJson, titulo, clicFila,
    onClicPositivo, onCLicDestructivo, disabledDestructivo, disabledPositivo, listaSeleccionada,
    esconderBusqueda
}) => {

    const [listaSeleccRecibida, setListaSeleccRecibida] = useState([]);
    const [seleccFiltroValor, setseleccFiltroValor] = useState(listaMenu ? listaMenu[0].valor : '');
    const [seleccFiltroTexto, setseleccFiltroTexto] = useState(listaMenu ? listaMenu[0].texto : '');
    //para esconder la sección de búsqueda en caso de ser necesario
    const [esconderFiltro, setEsconderFiltro] = useState(esconderBusqueda);
    const [classSeccBusqueda, setClassSeccBusqueda] = useState(
        esconderFiltro ? 'seccBusqueda esconderBusqueda' : 'seccBusqueda');

    useEffect(() => {
        setEsconderFiltro(esconderBusqueda);
    }, [esconderBusqueda]);

    useEffect(() => {
        setClassSeccBusqueda(esconderFiltro ? 'seccBusqueda esconderBusqueda' : 'seccBusqueda');
    }, [esconderFiltro]);

    useEffect(() => {
        //se pasa la lista recibida al padre a  través de una función
        listaSeleccionada && listaSeleccionada(listaSeleccRecibida);
    }, [listaSeleccRecibida]);

    const ManejarSelecFiltro = (e) => {
        const auxValor = e.target.value;
        const auxTexto = e.target.options[e.target.selectedIndex].text;
        setseleccFiltroValor(auxValor);
        setseleccFiltroTexto(auxTexto);
    }
    //Una vez se ha seleccionado una opción, incluso el primer valor al crear el hook
    useEffect(() => {
        filtrarPor && seleccFiltroValor !== '' ? filtrarPor(seleccFiltroValor) : PedirFuncionalidad();
    }, [seleccFiltroValor]);

    const ManejarTextoBusqueda = (texto) => {
        buscarPor && buscarPor(texto.target.value);
    }

    const PedirFuncionalidad = () => {
        alert("Agregar funcionalidad a este componente por favor...");
    }

    return (
        <div id='crudAvanzado'>

            <section className='upCrudAvanzado'>
                <article className={classSeccBusqueda}>
                    <div className='ladoIzq'>
                        <label htmlFor='filtroCrudAvanzado' >Filtrar por:</label>
                        <select name='filtroCrudAvanzado' onChange={listaMenu && ManejarSelecFiltro}>
                            {
                                listaMenu ?
                                    listaMenu.map((element, index) => (
                                        <option value={element.valor}>{element.texto}</option>
                                    ))
                                    : <option>seleccionar...</option>
                            }
                        </select>
                    </div>
                    <div className='ladoDer'>
                        <input placeholder={`Escribe ${seleccFiltroTexto} aquí...`} maxLength={50} onChange={ManejarTextoBusqueda}></input>
                    </div>
                </article>
                <article className='seccFiltroExtra'>
                    {seccLibre}
                </article>
            </section>

            <section className='centerCrudAvanzado'>
                <article className='seccListaAvanzada'>
                    <ListaAvanzada datosJson={datosJson} titulo={titulo} clickFila={clicFila}
                        listaSeleccProp={(lista) => setListaSeleccRecibida(lista)} />
                </article>
            </section>

            <section className='seccBotones'>
                <article className='contBtnPositivo boton'>
                    <BotonPositivo texto="Agregar" onClick={onClicPositivo} disabledProp={disabledPositivo} />
                </article>
                <article className='contBtnDestructivo boton'>
                    <BotonDestructivo texto="Eliminar" onClick={onCLicDestructivo}
                        disabledProp={disabledDestructivo} />
                </article>
                <article className='contBtnVolver boton'>
                    <BotonVolver />
                </article>
            </section>
        </div>
    );
}
export default CrudAvanzado;