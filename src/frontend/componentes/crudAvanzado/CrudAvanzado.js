import ListaAvanzada from '../listaAvanzada/ListaAvanzada';
import './CrudAvanzado.css';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonVolver from '../botonVolver/BotonVolver';
import { useState } from 'react';

const CrudAvanzado = ({seccLibre,listaMenu, filtrarPor, buscarPor, datosJson, titulo, clicFila,
    onClicPositivo, onCLicDestructivo, textoPostivo, textoDestructivo, disabledPositivo,
    disabledDestructivo, hiddenPositivo, hiddenDestructivo
}) => {

    const ManejarSelecFiltro = (e) => {
        const auxIndex = e.target.value;
        filtrarPor(auxIndex);
    }

    const ManejarTextoBusqueda = (texto) => {
        buscarPor(texto.target.value);
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
                    <ListaAvanzada datosJson={datosJson} titulo={titulo} clickFila={clicFila}/>
                </article>
            </section>

            <section className='seccBotones'>
                <article className='contBtnPositivo boton'>
                    <BotonPositivo texto={textoPostivo} onClick={onClicPositivo}
                    hiddenProp={hiddenPositivo} disabledProp={disabledPositivo}/>
                </article>
                <article className='contBtnDestructivo boton'>
                    <BotonDestructivo texto={textoDestructivo} onClick={onCLicDestructivo}
                    hiddenProp={hiddenDestructivo} disabledProp={disabledDestructivo}/>
                </article>
                <article className='contBtnVolver boton'>
                    <BotonVolver/>
                </article>
            </section>
        </div>
    );
}
export default CrudAvanzado;