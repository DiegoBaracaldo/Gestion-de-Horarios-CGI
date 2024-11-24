import BotonAtrasExclusivo from '../../componentes/botonAtrasExclusivo/BotonAtrasExclusivo';
import BotonProcesos from '../../componentes/botonProcesos/BotonProcesos';
import './GestionInformacion.css';

const GestionInformacion = () => {

    return (
        <div id='contGestionInfo'>
            <div className='contRutas'>
                <div className='izq contAux'>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="torrres"/>
                    </div>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="jornadas"/>
                    </div>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="programas"/>
                    </div>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="instructores" ruta="/crudInstructores"/>
                    </div>
                </div>
                <div className='der contAux'>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="ambientes" ruta="/crudAmbientes"/>
                    </div>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="grupos" ruta="/crudGrupos"/>
                    </div>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="competencias"/>
                    </div>
                    <div className='contBtnRutaInfo'>
                    </div>
                </div>
            </div>
            <div className='contBtnVolverExclu'>
                <BotonAtrasExclusivo />
            </div>
        </div>
    );
}
export default GestionInformacion;