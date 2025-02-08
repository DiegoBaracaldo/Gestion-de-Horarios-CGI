import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './Global.css';
import Principal from './frontend/paginas/principal/Principal';
import GestionInformacion from './frontend/paginas/gestionInformacion/GestionInformacion';
//import { datosJsonUno, tituloAux, subTitulosUno, subTitulosDos, datosJsonDos, datosJsonTres, subTitulosTres } from './frontend/mocks/mockTablaAvanzada';
import ListaBasica from './frontend/componentes/listaBasica/ListaBasica';
import { mocksBasica, mocksBasica2} from './frontend/mocks/mocksTablaBasica';
import CrudBasico from './frontend/componentes/crudBasico/CrudBasico';
import CrudTorres from './frontend/paginas/crudTorres/CrudTorres';
import CrudInstructores from './frontend/paginas/crudInstructores/CrudInstructores';
import CrudAmbientes from './frontend/paginas/crudAmbientes/CrudAmbientes';
import CrudGrupos from './frontend/paginas/crudGrupos/CrudGrupos';
import CrudCompetencias from './frontend/paginas/crudCompetencias/CrudCompetencias';
import CrudJornadas from './frontend/paginas/crudJornadas/CrudJornadas';
import CrudPrograma from './frontend/paginas/crudProgramas/CrudPrograma';
import GestionHorario from './frontend/paginas/gestionHorario/GestionHorario';
import PiscinaCompetencias from './frontend/paginas/horarioCompetencias/PiscinaCompetencias';
import Horario from './frontend/paginas/horario/horario';
import FusionGrupos from './frontend/paginas/fusionGrupos/FusionGrupos';
import HorarioPDF from './frontend/paginas/horarioPDF/HorarioPDF';

function App() {

  return (

    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Principal/>} />
          <Route path="/gestionInfo" element={<GestionInformacion/>} />
          <Route path="/gestionHorario" element={<GestionHorario/>} />
          <Route path="/gestionInfo" element={<GestionInformacion/>} />
          <Route path="/crudInstructores" element={<CrudInstructores/>} />
          <Route path="/crudAmbientes" element={<CrudAmbientes/>} />
          <Route path="/crudGrupos" element={<CrudGrupos/>} />
          <Route path="/crudCompetencias" element={<CrudCompetencias/>} />
          <Route path="/crudTorres" element={<CrudTorres/>} />
          <Route path="/crudJornada" element={<CrudJornadas/>} />
          <Route path="/crudProgramas" element={<CrudPrograma/>} />
          <Route path="/piscinaCompetencias" element={<PiscinaCompetencias/>} />
          <Route path="/horario" element={<Horario/>} />
          <Route path="/fusionGrupos" element={<FusionGrupos/>} />
          <Route path="/horarioPDF" element={<HorarioPDF/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
