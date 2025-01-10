import { useState } from 'react';
import BotonPositivo from '../../componentes/botonPositivo/BotonPositivo';
import BotonVolver from '../../componentes/botonVolver/BotonVolver';
import MarcoGralHorario from '../../componentes/marcoGeneralHorario/MarcoGralHorario';
import ProgramasGrupos from '../../componentes/programasGrupos/ProgramasGrupos';
import './PiscinaCompetencias.css';
import TarjetaCompetencia from '../../componentes/tarjetaCompetencia/TarjetaCompetencia';

const PiscinaCompetencias = () => {

    const competenciaMock = {
        id: '123456',
        descripcion: `Elaborar productos lácteos con base en leche de ratones calcificados con forticalcio
        a las  3 y 40 de la mañana mientras hay fuegos artificiales en miami de singapur.`
    }

    const arrayMock = [
        {
            id: '123456',
            nombre: 'Gastronomía integral colombiana',
            grupos: [
                {
                    id: '123456',
                    codigo: 'PPFFKIK89',
                    trimestre: 2
                },
                {
                    id: '234567',
                    codigo: 'GGF87HD89',
                    trimestre: 4
                },
                {
                    id: '345678',
                    codigo: 'MJBC9K89',
                    trimestre: 5
                }
            ]
        },
        {
            id: '987654',
            nombre: 'Análisis y desarrollo de software',
            grupos: [
                {
                    id: '86678',
                    codigo: 'GGGO876Y',
                    trimestre: 1
                },
                {
                    id: '5757484',
                    codigo: 'HNCNC76778',
                    trimestre: 2
                },
                {
                    id: '75795849',
                    codigo: 'JDOWMDN9',
                    trimestre: 6
                }
            ]
        }
    ];

    const [listaCompAux, setListaCompAux] = useState([]);

    const auxPositiva = () => {
        const listaAux = listaCompAux;
        listaAux.push(1);
        setListaCompAux([...listaAux]);
    }

    const auxNegativa = () => {
        const listaAux = listaCompAux;
        listaAux.pop();
        setListaCompAux([...listaAux]);
    }

    const [grupoSelecc, setGrupoSelecc] = useState({});

    return (
        <div id='contPiscinaCompetencias'>
            <MarcoGralHorario titulo={'Piscina de Competencias'}>
                <ProgramasGrupos grupoSelecc={(g) => setGrupoSelecc(g)} listaProgramas={arrayMock} />
                <div className='ladoDerechoCompetenciasPool'>
                    {
                        Object.keys(grupoSelecc).length < 1 ?
                            <h1>Selecciona un grupo de la lista...</h1>
                            :
                            <div className='tarjetaTitulo'>
                                <h2>Agregar todas las competencias requeridas para
                                    el grupo {grupoSelecc.codigo} en su
                                    trimestre {grupoSelecc.trimestre}
                                </h2>
                                <div className='contBtnAgregarComp'>
                                    <BotonPositivo texto={'+'} onClick={auxPositiva}/>
                                </div>
                            </div>
                    }
                    {
                        Array.isArray(listaCompAux) ?
                        listaCompAux.map(item => <TarjetaCompetencia competencia={competenciaMock}
                        onClicDestructivo={auxNegativa}/>)
                        : null
                    }
                </div>
            </MarcoGralHorario>
            <div className='contBotones'>
                <BotonPositivo texto={'confirmar'} />
                <BotonPositivo texto={'guardar'} />
                <BotonVolver />
            </div>
        </div>
    );
}
export default PiscinaCompetencias;