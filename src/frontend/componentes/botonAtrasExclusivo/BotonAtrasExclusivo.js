import { useEffect, useState } from 'react';
import './BotonAtrasExclusivo.css';
import { useNavigate } from 'react-router-dom';

const BotonAtrasExclusivo = () => {

    const navegar = useNavigate();

    const manejarOnClick = () => {
        navegar(-1);
    }
    return (
        <button id="btnAtrasExclusivo" onClick={manejarOnClick}>
            Atrás
        </button>
    );
}

export default BotonAtrasExclusivo;