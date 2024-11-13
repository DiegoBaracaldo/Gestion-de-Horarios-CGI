import './App.css';
import BotonAtrasExclusivo from './frontend/componentes/botonAtrasExclusivo/BotonAtrasExclusivo';
import BotonDestructivo from './frontend/componentes/botonDestructivo/BotonDestructivo';
import BotonDispHoraria from './frontend/componentes/botonDIspHoraria/BotonDispHoraria';
import BotonPositivo from './frontend/componentes/botonPositivo/BotonPositivo';
import BotonProcesos from './frontend/componentes/botonProcesos/BotonProcesos';
import BotonVolver from './frontend/componentes/botonVolver/BotonVolver';
import './Global.css';

function App() {
  return (
    <div className="App">
      <div className='auxBotones'>
        <BotonDispHoraria />
      </div>
    </div>
  );
}

export default App;
