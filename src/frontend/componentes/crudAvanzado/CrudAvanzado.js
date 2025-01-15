import ListaAvanzada from '../listaAvanzada/ListaAvanzada';
import './CrudAvanzado.css';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonVolver from '../botonVolver/BotonVolver';
import { useEffect, useState } from 'react';

const CrudAvanzado = ({ seccLibre, listaMenu, filtrarPor, buscarPor, datosJson, titulo, clicFila,
    onClicPositivo, onCLicDestructivo, disabledDestructivo, disabledPositivo,
    esconderBusqueda, subtitulos, modoSeleccion, listaSeleccionada, vaciarListaSelecc, modoSeleccMultiple,
    yaVienenSeleccionadas
}) => {

    const [seleccFiltroValor, setseleccFiltroValor] = useState(listaMenu ? listaMenu[0].valor : '');
    const [seleccFiltroTexto, setseleccFiltroTexto] = useState(listaMenu ? listaMenu[0].texto : '');
    const [textoInput, setTextoInput] = useState("");
    //Hook para que el CRUD se ponga en modo "selección"


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

    useEffect(() => {
        ManejarTextoBusqueda();
    }, [textoInput]);

    const ManejarTextoBusqueda = () => {
        buscarPor && buscarPor(textoInput);
    }

    const PedirFuncionalidad = () => {
        alert("Agregar funcionalidad a este componente por favor...");
    }

    return (
        <div id='crudAvanzado'>

            <section className='upCrudAvanzado'>
                {
                    esconderBusqueda ? null :
                        <article className="seccBusqueda">
                            <div className='ladoIzq'>
                                <label htmlFor='filtroCrudAvanzado' >Filtrar por:</label>
                                <select name='filtroCrudAvanzado' onChange={listaMenu && ManejarSelecFiltro}>
                                    {
                                        listaMenu ?
                                            listaMenu.map((element, index) => (
                                                <option key={index} value={element.valor}>{element.texto}</option>
                                            ))
                                            : <option>seleccionar...</option>
                                    }
                                </select>
                            </div>
                            <div className='ladoDer'>
                                <input placeholder={`Escribe ${seleccFiltroTexto} aquí...`}
                                    maxLength={50} onChange={e => setTextoInput(e.target.value)}
                                    value={textoInput}></input>
                            </div>
                        </article>
                }

                <article className='seccFiltroExtra'>
                    {seccLibre}
                </article>
            </section>

            <section className='centerCrudAvanzado'>
                <article className='seccListaAvanzada'>
                    <ListaAvanzada datosJson={datosJson} titulo={titulo} clickFila={clicFila}
                        listaSeleccProp={listaSeleccionada && listaSeleccionada}
                        subtitulos={subtitulos} modoSeleccion={modoSeleccion}
                        vaciarListaSelecc={vaciarListaSelecc} modoSeleccionMultiple={modoSeleccMultiple} 
                        yaVienenSeleccionadas={yaVienenSeleccionadas}/>
                </article>
            </section>

            <section className='seccBotones'>
                {
                    modoSeleccion ? null :
                        <article className='contBtnPositivo boton'>
                            <BotonPositivo texto={modoSeleccMultiple ? 'confirmar' : 'Agregar'}
                                onClick={onClicPositivo} disabledProp={disabledPositivo} />
                        </article>
                }
                {
                    modoSeleccion ?
                        <article className='contBtnDestructivo boton'>
                            <BotonDestructivo texto="Cancelar" onClick={onCLicDestructivo} />
                        </article>
                        :
                        <article className='contBtnDestructivo boton'>
                            <BotonDestructivo
                             texto={!modoSeleccMultiple ? 'Eliminar' : 'cancelar'}
                                onClick={onCLicDestructivo}
                                disabledProp={disabledDestructivo} />
                        </article>
                }

                {
                    modoSeleccion || modoSeleccMultiple ? null :
                        <article className='contBtnVolver boton'>
                            <BotonVolver />
                        </article>
                }


            </section>
        </div>
    );
}
export default CrudAvanzado;