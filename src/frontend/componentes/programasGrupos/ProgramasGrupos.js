import { useEffect, useState } from 'react';
import './ProgramasGrupos.css';

const ProgramasGrupos = ({
    grupoSelecc,
    listaProgramas,
    listaParaListaCompletado
}) => {


    const [programasExpandidos, setProgramasExpandidos] =
        useState(new Array(grupoSelecc.length).fill(false));


    const ManejarSeleccGrupo = (grupo, indexPrograma, indexGrupo) => {
        if (typeof grupoSelecc === 'function') grupoSelecc(grupo, indexPrograma, indexGrupo);
    }

    const ManejarTogle = (e, index) => {
        const estado = e.target.open;
        const listaAux = programasExpandidos;
        listaAux[index] = estado;
        setProgramasExpandidos([...listaAux]);
    }

    return (
        <div id='contProgramasGrupos'>
            <ul>
                {
                    Array.isArray(listaProgramas) && listaProgramas.map((programa, i) => {
                        return (
                            <li key={programa.id}>
                                <details onToggle={(e) => ManejarTogle(e, i)}>
                                    <summary className='programaLista'
                                        style={{
                                            backgroundColor:Array.isArray(listaParaListaCompletado) &&
                                                listaParaListaCompletado.length > 0 &&
                                                    listaParaListaCompletado[i].completado ?
                                                    '#39A900' : '#385C57'
                                        }}>
                                        <h4>{programa.nombre}</h4>
                                        <h1>{programasExpandidos[i] ? '-' : '+'}</h1>
                                    </summary>
                                    <ul>
                                        {Array.isArray(programa.grupos) && programa.grupos.map((grupo, j) => {
                                            return (
                                                <li key={grupo.id} className='grupoLista'>
                                                    <input type='radio' name='gruposRadio' id={grupo.codigoGrupo}
                                                        onChange={() => ManejarSeleccGrupo(grupo, i, j)} />
                                                    <label htmlFor={grupo.codigoGrupo}>
                                                        Grupo {Array.isArray(listaParaListaCompletado) &&
                                                            listaParaListaCompletado.length > 0 &&
                                                                listaParaListaCompletado[i].gruposCompletados[j] ?
                                                                grupo.codigoGrupo + " ✔️" : grupo.codigoGrupo
                                                        }
                                                    </label>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </details>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default ProgramasGrupos;