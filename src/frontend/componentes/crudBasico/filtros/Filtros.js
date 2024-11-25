import React, { useState } from 'react';
import './Filtros.css'

function Filtro({ titulo, opciones }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    console.log(`Opción seleccionada: ${option}`);
  };

  return (
    <div className='filtros'>
      <h3>{titulo}</h3>
      <input type='text' placeholder='Buscar...' />

      {/* Botón desplegable */}
      <div className='dropdown-container'>
        <button className='dropdown-button' onClick={toggleDropdown}>
          {selectedOption || 'Opciones'}
        </button>
        {isDropdownOpen && (
          <div className='dropdown-menu'>
            {opciones.map((opcion, index) => (
              <div
                key={index}
                className='dropdown-item'
                onClick={() => handleOptionClick(opcion)}
              >
                {opcion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Filtro;
