import ListaAvanzada from '../listaAvanzada/ListaAvanzada';
import './CrudAvanzado.css';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonVolver from '../botonVolver/BotonVolver';
import { useEffect, useState } from 'react';

const CrudAvanzado = ({ seccLibre, listaMenu, filtrarPor, buscarPor, datosJson, titulo, clicFila,
    onClicPositivo, onCLicDestructivo, disabledDestructivo, listaSeleccionada
}) => {

    const [listaSeleccRecibida, setListaSeleccRecibida] = useState([]);
    useEffect(() => {
        //se pasa la lista recibida al padre a  través de una función
        listaSeleccionada && listaSeleccionada(listaSeleccRecibida);
    }, [listaSeleccRecibida]);

    const ManejarSelecFiltro = (e) => {
        const auxIndex = e.target.value;
        filtrarPor && filtrarPor(auxIndex);
    }

    const ManejarTextoBusqueda = (texto) => {
        buscarPor && buscarPor(texto.target.value);
    }

    const PedirFuncionalidad = () => {
        alert("Agregar funcionalidad a este componente por favor...");
    }

    return (
        <div id='crudAvanzado'>

            <section className='upCrudAvanzado'>
                <article className='seccBusqueda'>
                    <div className='ladoIzq'>
                        <label htmlFor='filtroCrudAvanzado' >Filtrar por:</label>
                        <select name='filtroCrudAvanzado' onChange={listaMenu && (filtrarPor ? ManejarSelecFiltro : PedirFuncionalidad)}>
                            {
                                listaMenu ?
                                    listaMenu.map((texto, index) => (
                                        <option>{texto}</option>
                                    ))
                                    : <option>seleccionar...</option>
                            }
                        </select>
                    </div>
                    <div className='ladoDer'>
                        <input placeholder='Buscar...' maxLength={50} onChange={ManejarTextoBusqueda}></input>
                    </div>
                </article>
                <article className='seccFiltroExtra'>
                    {seccLibre}
                </article>
            </section>

            <section className='centerCrudAvanzado'>
                <article className='seccListaAvanzada'>
                    <ListaAvanzada datosJson={datosJson} titulo={titulo} clickFila={clicFila} 
                    listaSeleccProp={(lista) => setListaSeleccRecibida(lista)}/>
                </article>
            </section>

            <section className='seccBotones'>
                <article className='contBtnPositivo boton'>
                    <BotonPositivo texto="Agregar" onClick={onClicPositivo} />
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