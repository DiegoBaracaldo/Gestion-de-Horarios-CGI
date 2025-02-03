import BotonDestructivo from '../botonDestructivo/BotonDestructivo';
import './TarjetaHuesped.css';

const TarjetaHuesped = ({ grupo, onClicDestructivo }) => {

    const ManejarOnClic = () => {
        if (typeof onClicDestructivo === 'function') onClicDestructivo(grupo);
        else return null;
    }

    return (
        <div id='contTarjetaHuesped'>
            <h3>{grupo?.codigoGrupo}</h3>
            <div className='contInfoGrupoHuesped'>
                <div>
                    <span className='etTitulo'>ficha: </span><br/>
                    <span className='etContenido'>{grupo.id}</span>
                </div>
                <div>
                    <span className='etTitulo'>cantidad aprendices: </span><br/>
                    <span className='etContenido'>{grupo.cantidadAprendices}</span>
                </div>
                <div>
                    <span className='etTitulo'>es cadena formación: </span><br/>
                    <span className='etContenido'>{grupo.esCadenaFormacion ? 'si' : 'no'}</span>
                </div>
                <div>
                    <span className='etTitulo'>jornada: </span><br/>
                    <span className='etContenido'>{grupo.jornada}</span>
                </div>
                <div>
                    <span className='etTitulo'>responsable: </span><br/>
                    <span className='etContenido'>{grupo.nombreResponsable}</span>
                </div>
                <div>
                    <span className='etTitulo'>trimestre lectivo: </span><br/>
                    <span className='etContenido'>{grupo.trimestreLectivo}</span>
                </div>
            </div>
            <div className='contBtnDestructivo'>
                <BotonDestructivo texto={'x'} onClick={ManejarOnClic} />
            </div>
        </div>
    );
}

export default TarjetaHuesped;