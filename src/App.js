import './App.css';
import BotonAtrasExclusivo from './frontend/componentes/botonAtrasExclusivo/BotonAtrasExclusivo';
import BotonDestructivo from './frontend/componentes/botonDestructivo/BotonDestructivo';
import BotonDispHoraria from './frontend/componentes/botonDIspHoraria/BotonDispHoraria';
import BotonPositivo from './frontend/componentes/botonPositivo/BotonPositivo';
import BotonProcesos from './frontend/componentes/botonProcesos/BotonProcesos';
import BotonVolver from './frontend/componentes/botonVolver/BotonVolver';
import ListaAvanzada from './frontend/componentes/listaAvanzada/ListaAvanzada';
import './Global.css';
import { datosJsonUno, tituloAux, subTitulosUno, subTitulosDos, datosJsonDos, datosJsonTres, subTitulosTres } from './frontend/mocks/mockTablaAvanzada';

function App() {

const Saludar = (nombre) => {
  alert("hola " + nombre )
}

  return (
    <div className="App">
      <div className='auxListaAvanzada'>
        <ListaAvanzada titulo={tituloAux} datosJson={datosJsonUno} subtitulos={subTitulosUno} 
        clickFila={Saludar}/>

      </div>
    </div>
  );
}

export default App;
