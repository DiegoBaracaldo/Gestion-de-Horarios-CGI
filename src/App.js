import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './Global.css';
import Principal from './frontend/paginas/principal/Principal';
import GestionInformacion from './frontend/paginas/gestionInformacion/GestionInformacion';
import CrudInstructores from './frontend/paginas/crudInstructores/CrudInstructores';
import CrudAmbientes from './frontend/paginas/crudAmbientes/CrudAmbientes';
import CrudGrupos from './frontend/paginas/crudGrupos/CrudGrupos';
import CrudCompetencias from './frontend/paginas/crudCompetencias/CrudCompetencias';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Principal/>} />
          <Route path="/gestionInfo" element={<GestionInformacion/>} />
          <Route path="/crudInstructores" element={<CrudInstructores/>} />
          <Route path="/crudAmbientes" element={<CrudAmbientes/>} />
          <Route path="/crudGrupos" element={<CrudGrupos/>} />
          <Route path="/crudCompetencias" element={<CrudCompetencias/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
