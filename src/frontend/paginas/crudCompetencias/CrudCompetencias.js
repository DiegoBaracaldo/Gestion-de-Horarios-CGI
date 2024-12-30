import { useEffect, useState } from 'react';
import CrudAvanzado from '../../componentes/crudAvanzado/CrudAvanzado';
import { datosJsonDos, datosJsonTres, datosJsonUno, listaMenuFiltro, tituloAux } from '../../mocks/MockCrudAvanzado';
import './CrudCompetencias.css';
import {listaMenuCompetencias } from '../ListasMenuFiltro';
import ModalCompetencias from '../../modales/modalCompetencias/ModalCompetencias';
import CompetenciaServicio from '../../../backend/repository/servicios/CompetenciaService';
import FiltroGeneral from '../../../backend/filtro/FiltroGeneral';
import { mockCompetenciasTres } from '../../mocks/MocksCompetencias';
import CrudPrograma from '../crudProgramas/CrudPrograma';

const CrudCompetencias = () => {

    const subs = ['Código', 'Descripción Corta', 'Horas Semanales']

    const [competenciaConsultada, setCompetenciaConsultada] = useState({});

    const [nombrePrograma, setNombrePrograma] = useState('Seleccionar programa...');
    const [seleccPrograma, setSeleccPrograma] = useState(false);
    const [programa, setPrograma] = useState({});
    useEffect(() => {
        if(Object.keys(programa).length > 0){
            CargarLista();
            setEsconderBusqueda(false);
            setNombrePrograma(programa.nombre);
        }else{
            setEsconderBusqueda(true);
        }
    }, [programa]);

    const CargarLista = async () => {
        console.log("cargando lista...");
        try {
          setListaObjetos(await new CompetenciaServicio().CargarLista(programa.id));
        } catch (error) {
          console.log("error en crud competencias por: ", error);
          setListaObjetos([]);
        }
    }

    const [listaSelecciones, setListaSelecciones] = useState([]);
    const [listaVacia, setListaVacia] = useState(true);
    const [listaObjetos, setListaObjetos] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [listaAdaptada, setListaAdaptada] = useState([]);
    const [esconderBusqueda, setEsconderBusqueda] = useState(true);
    const [btnAgregarOff, setBtnAgregarOff] = useState(true);

    useEffect(() => {
        CargarLista();
    }, []);

    useEffect(() => {
        setListaFiltrada(listaObjetos);
    }, [listaObjetos]);


    //convierto la lista de objetos con todos los datos en una con los 4 a mostrar en la tabla
    useEffect(() => {
        const listaAux = [];
        listaFiltrada &&
            listaFiltrada.forEach((element) => {
                let objetoAux = {};
                objetoAux.id = element.id;
                objetoAux.descripcion = element.descripcion;
                objetoAux.horasRequeridas = element.horasRequeridas;
                listaAux.push(objetoAux);
            });
        setListaAdaptada(listaAux);
    }, [listaFiltrada]);

    //captura de palabras para filtro y búsqueda
    const [seleccMenuFiltro, setSeleccMenuFiltro] = useState('');
    const [textoBusqueda, setTextoBusqueda] = useState('');

    useEffect(() => {
        setBtnAgregarOff(esconderBusqueda);
    }, [esconderBusqueda]);

    useEffect(() => {
        setListaVacia(listaSelecciones.length === 0);
    }, [listaSelecciones]);

    /////////// SECCIÓN DE FILTRO Y BÚSQUEDA /////////////
    const Filtrar = () => {
        setListaFiltrada(FiltroGeneral(seleccMenuFiltro, textoBusqueda, listaObjetos));
    }
    //cada vez que cambia el texto de búsqueda, con DEBOUNCE aplicado
    useEffect(() => {
        if(listaObjetos.length > 0)setTimeout(Filtrar, "50");
    }, [textoBusqueda]);
    /////////////////////////////////////////////////////

    //sección libre del crud
    const btnSeleccPrograma = <button className='btnSeleccPrograma' onClick={() => setSeleccPrograma(true)}>
        {nombrePrograma}
    </button>

    ///////// SECCIÓN DE CONSULTA ///////////////
    const [abrirConsulta, setAbrirConsulta] = useState(false);

    const AbrirConsulta = (e) => {
        DefinirCompetConsultada(e.id);
        setAbrirConsulta(true);
    }

    const DefinirCompetConsultada = (idCompetencia) => {
        let compAux = {};
        listaFiltrada.forEach((competencia) => {
            if(competencia.id === idCompetencia) compAux = competencia;
        });
        setCompetenciaConsultada(compAux);
    }

    ///////// SECCIÓN DE REGISTRO ///////////////
    const [abrirRegistro, setAbrirRegistro] = useState(false);

    const AbrirRegistro = () => {
        setAbrirRegistro(true);
    }

    const CerrarModal = () => {
        setAbrirRegistro(false);
        setAbrirConsulta(false);
        setCompetenciaConsultada({});
        CargarLista();
    }

    function EliminarCompetencias(){
        const competenciaServicio = new CompetenciaServicio();
        const listaAuxID = listaSelecciones.map(comp => comp.id);
        competenciaServicio.EliminarCompetencia(listaAuxID);
    }

    const OnClicDestructivo = () => {
        const confirmar = window.confirm("¿Confirma que desea eliminar las competencias seleccionadas?");
        if(confirmar){
          EliminarCompetencias();
          alert("Competencias eliminadas satisfactoriamente!");
          CargarLista();
        }else{
          return null;
        }
    }

    return (
        <div id='contCrudCompetencias'>
            <CrudAvanzado listaSeleccionada={(lista) => setListaSelecciones(lista)}
                disabledDestructivo={listaVacia} titulo="Competencias"
                listaMenu={listaMenuCompetencias} filtrarPor={(texto) => setSeleccMenuFiltro(texto)}
                buscarPor={(texto) => setTextoBusqueda(texto)} esconderBusqueda={esconderBusqueda}
                seccLibre={btnSeleccPrograma} disabledPositivo={btnAgregarOff} onClicPositivo={AbrirRegistro}
                clicFila={AbrirConsulta} datosJson={esconderBusqueda ? null : listaAdaptada}
                subtitulos={subs} 
                onCLicDestructivo={OnClicDestructivo}/>
            {
                abrirRegistro || abrirConsulta ?
                    <ModalCompetencias abrirConsulta={abrirConsulta} abrirRegistro={abrirRegistro}
                        onCloseProp={() => CerrarModal()} programa={programa}
                        objConsulta={competenciaConsultada}/> 
                        : null
            }
            {
                seleccPrograma ? <CrudPrograma modoSeleccion={true}
                    onClose={() => setSeleccPrograma(false)}
                    programaSeleccionado={(p) => setPrograma(p)} />
                    : null
            }
        </div>
    );
}
export default CrudCompetencias;