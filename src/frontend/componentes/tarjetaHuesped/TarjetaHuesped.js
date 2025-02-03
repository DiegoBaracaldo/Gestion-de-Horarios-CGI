import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import './TarjetaHuesped.css';

const TarjetaHuesped = ({ grupo, onClicDestructivo }) => {

    const ManejarOnClic = () => {
        if (typeof onClicDestructivo === 'function') onClicDestructivo();
        else return null;
    }

    return (
        <div id='contTarjetaHuesped'>
            <h3>{grupo?.codigoGrupo}</h3>
            <div className='contInfoGrupoHuesped'>
                <p>{grupo?.id}</p>
            </div>
            <div className='contBtnDestructivo'>
                <BotonDestructivo texto={'x'} onClick={ManejarOnClic} />
            </div>
        </div>
    );
}

export default TarjetaHuesped;