import BotonProcesos from "../../componentes/botonProcesos/BotonProcesos";
import Logo from "../../componentes/logo/Logo";


const Principal = () => {
    return (
        <div id="contPrincipal">
            <div id='contLogoPrincipal'>
                <Logo/>
            </div>
            <h1 id='tituloPagPrincipal'>gestión de horario CGI</h1>
            <div id='contBtnGestInf' className='contBtnPrincipal' >
                <BotonProcesos texto="gestión de información" ruta={"/gestionInfo"}/>
            </div>
            <div id='contBtnGestHorario' className='contBtnPrincipal'>
                <BotonProcesos texto="gestión de horario" ruta={"/gestionHorario"}/>
            </div>
        </div>
    );
}
export default Principal;