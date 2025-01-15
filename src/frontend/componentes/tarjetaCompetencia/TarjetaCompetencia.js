import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import './TarjetaCompetencia.css';

const TarjetaCompetencia = ({ competencia, onClicDestructivo }) => {

    const ManejarOnClic = () => {
        if (typeof onClicDestructivo === 'function') onClicDestructivo();
        else return null;
    }

    return (
        <div id='contTarjetaCompetenciaPiscina'>
            <h3>{competencia ? competencia.id : ''}</h3>
            <p>{competencia ? competencia.descripcion : ''}</p>
            <div className='contBtnDestructivo'>
                <BotonDestructivo texto={'-'} onClick={ManejarOnClic} />
            </div>
        </div>
    );
}

export default TarjetaCompetencia;