import BotonProcesos from "../../componentes/botonProcesos/BotonProcesos";


const Principal = () => {
    return (
        <div id="contPrincipal">
            <div id='contLogoPrincipal'>
                espacio para el logo
            </div>
            <h1 id='tituloPagPrincipal'>gestión de horario CGI</h1>
            <div id='contBtnGestInf' className='contBtnPrincipal' >
                <BotonProcesos texto="gestión de información" ruta={"/gestionInfo"}/>
            </div>
            <div id='contBtnGestHorario' className='contBtnPrincipal'>
                <BotonProcesos texto="gestión de horarios" />
            </div>
        </div>
    );
}
export default Principal;