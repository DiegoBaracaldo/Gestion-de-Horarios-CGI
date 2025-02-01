import { useEffect } from 'react';
import BotonAtrasExclusivo from '../../componentes/botonAtrasExclusivo/BotonAtrasExclusivo';
import BotonProcesos from '../../componentes/botonProcesos/BotonProcesos';
import './GestionInformacion.css';
import Swal from 'sweetalert2';

const GestionInformacion = () => {

    useEffect(() => {
        Swal.fire(`Cualquier cambio en los datos de esta página, afectará directamente
             el horario de clases establecido!`);
    }, []);

    return (
        <div id='contGestionInfo'>
            <div className='contRutas'>
                <div className='izq contAux'>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="torres" ruta={"/crudTorres"}/>
                    </div>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="jornadas" ruta={"/crudJornada"}/>
                    </div>
                    <div className='contBtnRutaInfo'>
                        <BotonProcesos texto="programas" ruta="/crudProgramas"/>
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
                        <BotonProcesos texto="competencias" ruta="/crudCompetencias"/>
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