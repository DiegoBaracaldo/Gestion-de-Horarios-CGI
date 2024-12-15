import React, { useEffect, useState } from 'react';
import ListaBasica from '../listaBasica/ListaBasica';
import { mocksBasica } from '../../mocks/mocksTablaBasica';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonVolver from '../botonVolver/BotonVolver';
import './CrudBasico.css';

function CrudBasico({
  onClickPositivo,
  onClickDestructivo,
  entidad,
  propiedadTabla,
  nameFiltro,
  opciones,
  esconderBusqueda,
  esconderOpciones,
  esconderGeneral,
  esconderEntidad,
  esconderBoton,
  listaSeleccionada,
  busqueda,
  disabledDestructivo,
  clic,
  seleccFiltro,
  modoSeleccion,
  agregar
}) {
  const [listaSeleccRecibida, setListaSeleccRecibida] = useState([]);
  const [textoBuscar, setTextoBuscar] = useState('');
  const [textoAgregar, setTextoAgregar] = useState('');

  useEffect(() => {
    busqueda && busqueda(textoBuscar);
  }, [textoBuscar]);
  
  useEffect(() => {
    agregar && agregar(textoAgregar);
  }, [textoAgregar]);

  const handleOptionClick = (e) => {
    const opcion = e.target.value;
    console.log(opcion);
    seleccFiltro && seleccFiltro(opcion); // Actualiza la opción seleccionada
  };

  return (
    <div id="crudBasico">
      <div className="container">
        {/* Espacio izquierdo de tabla */}
        <div className="izquierda">
          <div className="tabla">
            <ListaBasica nameList={entidad} datosJson={propiedadTabla} clic={clic}
              listaSeleccProp={(lista) => listaSeleccionada(lista)}
              modoSeleccion={modoSeleccion} />
          </div>
        </div>

        {/* Espacio derecho botones y búsqueda */}
        <div className="derecha">
          {/* Bloque condicional para Nueva Entidad y Botón en el mismo div */}
          <div className="filtros">
            {/* Condicional para Nueva Entidad */}
            {modoSeleccion ? null : (
              <>
                <h3>Nueva {entidad}:</h3>
                {
                  esconderEntidad ? null :
                    <input type="text" placeholder="Agregar..." maxLength={100} 
                    value={textoAgregar} onChange={(e) => setTextoAgregar(e.target.value)}/>
                }
              </>
            )}

            {/* Condicional para Botón */}
            {modoSeleccion ? null : (
              <div className="agregar">
                <BotonPositivo texto="Agregar"
                  onClick={onClickPositivo && onClickPositivo} />
              </div>
            )}
          </div>

          {/* Bloque general para búsqueda y opciones */}
          {esconderGeneral ? null : (
            <section className="filtros">
              {/* Filtro de búsqueda */}
              {esconderBusqueda ? null : (
                <div>
                  <h3>{nameFiltro}</h3>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={textoBuscar} // Asegura que busqueda nunca sea undefined
                    onChange={e => setTextoBuscar(e.target.value)}
                    maxLength={20} />
                </div>
              )}

              {/* Dropdown de opciones */}
              {esconderOpciones ? null : (
                <div className="dropdown-container">
                  <select className='dropdown-button' onChange={handleOptionClick}>
                    <option value={"todos"} className='dropdown-item'>
                      Todos
                    </option>
                    <option value={"cursoCorto"} className='dropdown-item'>
                      Curso corto
                    </option>
                    <option value={"tecnico"} className='dropdown-item'>
                      Técnico
                    </option>
                    <option value={"tecnologo"} className='dropdown-item'>
                      Tecnólogo
                    </option>

                  </select>
                </div>
              )}
            </section>
          )}

          {/* Botones de acción */}
          <div className="botones">
            {
              modoSeleccion ? <BotonDestructivo texto="Cancelar" onClick={onClickDestructivo} />
                :
                <BotonDestructivo texto="Eliminar" onClick={onClickDestructivo}
                  disabledProp={disabledDestructivo} />
            }
            <br />
            {
              modoSeleccion ? null : <BotonVolver />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrudBasico;
