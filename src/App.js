import './App.css';
import BotonAtrasExclusivo from './frontend/componentes/botonAtrasExclusivo/BotonAtrasExclusivo';
import BotonDestructivo from './frontend/componentes/botonDestructivo/BotonDestructivo';
import BotonDispHoraria from './frontend/componentes/botonDIspHoraria/BotonDispHoraria';
import BotonPositivo from './frontend/componentes/botonPositivo/BotonPositivo';
import BotonProcesos from './frontend/componentes/botonProcesos/BotonProcesos';
import BotonVolver from './frontend/componentes/botonVolver/BotonVolver';
import ListaAvanzada from './frontend/componentes/listaAvanzada/ListaAvanzada';
import './Global.css';

function App() {

  return (
    <div className="App">
      <div id='contLogoPrincipal'>
        espacio para el logo
      </div>
      <h1 id='tituloPagPrincipal'>gestión de horario CGI</h1>
      <div id='contBtnGestInf' className='contBtnPrincipal' >
        <BotonProcesos texto="gestión de información"/>
      </div>
      <div id='contBtnGestHorario' className='contBtnPrincipal'>
        <BotonProcesos texto="gestión de horarios"/>
      </div>
    </div>
  );
}

export default App;
