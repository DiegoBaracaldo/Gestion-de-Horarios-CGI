import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BotonAtrasExclusivo from './frontend/componentes/botonAtrasExclusivo/BotonAtrasExclusivo';
import BotonDestructivo from './frontend/componentes/botonDestructivo/BotonDestructivo';
import BotonDispHoraria from './frontend/componentes/botonDIspHoraria/BotonDispHoraria';
import BotonPositivo from './frontend/componentes/botonPositivo/BotonPositivo';
import BotonProcesos from './frontend/componentes/botonProcesos/BotonProcesos';
import BotonVolver from './frontend/componentes/botonVolver/BotonVolver';
import ListaAvanzada from './frontend/componentes/listaAvanzada/ListaAvanzada';
import './Global.css';
import Principal from './frontend/paginas/principal/Principal';
import GestionInformacion from './frontend/paginas/gestionInformacion/GestionInformacion';
import { datosJsonUno, tituloAux, subTitulosUno, subTitulosDos, datosJsonDos, datosJsonTres, subTitulosTres } from './frontend/mocks/mockTablaAvanzada';
import ListaBasica from './frontend/componentes/listaBasica/ListaBasica';
import { mocksBasica, mocksBasica2} from './frontend/mocks/mocksTablaBasica';
import CrudBasico from './frontend/componentes/crudBasico/CrudBasico';
function App() {

  return (

    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Principal/>} />
          <Route path="/gestionInfo" element={<GestionInformacion isOpen={true}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
