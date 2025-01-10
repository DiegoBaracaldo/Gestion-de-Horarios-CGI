import { useState } from 'react';
import './ProgramasGrupos.css';

const ProgramasGrupos = ({ grupoSelecc, listaProgramas }) => {

    const [programasExpandidos, setProgramasExpandidos] =
        useState(new Array(grupoSelecc.length).fill(false));


    const ManejarSeleccGrupo = (grupo) => {
        if (typeof grupoSelecc === 'function') grupoSelecc(grupo);
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
                    Array.isArray(listaProgramas) && listaProgramas.map((programa, index) => {
                        return (
                            <li key={programa.id}>
                                <details onToggle={(e) => ManejarTogle(e, index)}>
                                    <summary className='programaLista'>
                                        <h4>{programa.nombre}</h4>
                                        <h1>{programasExpandidos[index] ? '-' : '+'}</h1>
                                    </summary>
                                    <ul>
                                        {programa.grupos.map((grupo) => {
                                            return (
                                                <li key={grupo.id} className='grupoLista'>
                                                    <input type='radio' name='gruposRadio' id={grupo.codigo}
                                                        onChange={() => ManejarSeleccGrupo(grupo)} />
                                                    <label htmlFor={grupo.codigo}>
                                                        Grupo {grupo.codigo}
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