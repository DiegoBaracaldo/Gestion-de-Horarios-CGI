import React, { useState } from 'react';
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
  busqueda,
  clic,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para el dropdown
  const [selectedOption, setSelectedOption] = useState(''); // Opción seleccionada

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionClick = (opcion) => {
    setSelectedOption(opcion); // Actualiza la opción seleccionada
    setIsDropdownOpen(false); // Cierra el menú desplegable
  };

  return (
    <div id="crudBasico">
      <div className="container">
        {/* Espacio izquierdo de tabla */}
        <div className="izquierda">
          <div className="tabla">
            <ListaBasica nameList={entidad} datosJson={propiedadTabla} clic={clic} />
          </div>
        </div>

        {/* Espacio derecho botones y búsqueda */}
        <div className="derecha">
          {/* Bloque condicional para Nueva Entidad y Botón en el mismo div */}
          <div className="filtros">
            {/* Condicional para Nueva Entidad */}
            {esconderEntidad ? null : (
              <>
                <h3>Nueva {entidad}:</h3>
                <input type="text" placeholder="Agregar..." />
              </>
            )}

            {/* Condicional para Botón */}
            {esconderBoton ? null : (
              <div className="agregar">
                <BotonPositivo texto="Agregar" onClick={onClickPositivo} />
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
                    value={busqueda || ''} // Asegura que busqueda nunca sea undefined
                  />
                </div>
              )}

              {/* Dropdown de opciones */}
              {esconderOpciones ? null : (
                <div className="dropdown-container">
                  <button className="dropdown-button" onClick={toggleDropdown}>
                    {selectedOption || 'Opciones'}
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {(opciones || []).map((opcion, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleOptionClick(opcion)}
                        >
                          {opcion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Botones de acción */}
          <div className="botones">
            <BotonDestructivo texto="Eliminar" onClick={onClickDestructivo} />
            <br />
            <BotonVolver />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrudBasico;
