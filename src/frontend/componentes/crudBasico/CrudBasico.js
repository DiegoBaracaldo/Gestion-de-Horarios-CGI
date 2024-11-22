import React, { useState } from 'react';
import ListaBasica from '../listaBasica/ListaBasica';
import { mocksBasica } from '../../mocks/mocksTablaBasica';
import BotonPositivo from '../botonPositivo/BotonPositivo';
import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import BotonVolver from '../botonVolver/BotonVolver';

import './CrudBasico.css';

function CrudBasico({onClickPositivo,onClickDestructivo, entidad}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para el dropdown
  const [selectedOption, setSelectedOption] = useState(''); // Opción seleccionada

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Actualiza la opción seleccionada
    setIsDropdownOpen(false); // Cierra el dropdown
    
  };

  return (
    <div className='container'>
      {/* Espacio izquierdo de tabla */}
      <div className='izquierda'>
        <div className='tabla'>
          <ListaBasica nameList={entidad} datosJson={mocksBasica} />
        </div>
      </div>

      {/* Espacio derecho botones y búsqueda */}
      <div className='derecha'>
        <div className='filtros'>
            <h3>Nueva {entidad}:</h3>
          <input type='text' placeholder='agregar...' />

          <div className='agregar'>
          <BotonPositivo texto={'agregar'} onClick={onClickPositivo} />
        </div>


        <h3>Filtro por nombre</h3>
        <input type='text' placeholder='Buscar...' />
        
          {/* Botón desplegable */}
          <div className='dropdown-container'>
            <button className='dropdown-button' onClick={toggleDropdown}>
              {selectedOption || 'Opciones'}
            </button>
            {isDropdownOpen && (
              <div className='dropdown-menu'>
                <div
                  className='dropdown-item'
                  onClick={() => handleOptionClick('Opción 1')}
                >
                  Opción 1
                </div>
                <div
                  className='dropdown-item'
                  onClick={() => handleOptionClick('Opción 2')}
                >
                  Opción 2
                </div>
                <div
                  className='dropdown-item'
                  onClick={() => handleOptionClick('Opción 3')}
                >
                  Opción 3
                </div>
              </div>
            )}
          </div>
        </div>



        <div className='botones'>
          <BotonDestructivo texto={'eliminar'} onClick={onClickDestructivo} />
          <br />
          <BotonVolver/>
        </div>
      </div>
    </div>
  );
}

export default CrudBasico;
