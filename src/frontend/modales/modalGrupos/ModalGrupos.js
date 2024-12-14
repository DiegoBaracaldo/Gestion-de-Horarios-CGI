import { useEffect, useState } from 'react';
import ModalGeneral from '../../componentes/modalGeneral/ModalGeneral';
import BotonDispHoraria from '../../componentes/botonDIspHoraria/BotonDispHoraria';
import CrudInstructores from '../../paginas/crudInstructores/CrudInstructores';
import CrudPrograma from '../../paginas/crudProgramas/CrudPrograma';
import CrudJornadas from '../../paginas/crudJornadas/CrudJornadas';

const ModalGrupos = ({ abrirConsulta, abrirRegistro, onCloseProp }) => {

    // para manejar los inputs enviados según si se pueden editar o no
    const [inputsOff, setInputsOff] = useState(false);
    const [seActivoEdicion, setSeActivoEdicion] = useState(false);
    const [seleccResponsable, setSeleccResponsable] = useState(false);
    const [responsable, setResponsable] = useState(null);
    const [seleccPrograma, setSeleccPrograma] = useState(false);
    const [programa, setPrograma] = useState(null);
    const [seleccJornada, setSeleccJornada] = useState(false);
    const [jornada, setJornada] = useState(null);

    useEffect(() => {
         responsable && console.log(responsable.nombre);
    }, [responsable]);

    useEffect(() => {
         programa && console.log(programa.nombre);
    }, [programa]);

    useEffect(() => {
         jornada && console.log(jornada.tipo);
    }, [jornada]);

    return (
        <ModalGeneral isOpenRegistro={abrirRegistro} onClose={onCloseProp && (() => onCloseProp())}
            isOpenConsulta={abrirConsulta}
            bloquearInputs={(valor) => setInputsOff(valor)}
            edicionActivada={(valor) => setSeActivoEdicion(valor)}>
            <div className='seccCajitasModal'>
                <section>
                    <label>programa: </label>
                    <button disabled={inputsOff} onClick={() => setSeleccPrograma(true)}>
                        Seleccionar...</button>
                </section>
                <section>
                    <label>ficha: </label>
                    <input maxLength={20} disabled={inputsOff} />
                </section>
                <section>
                    <label>código grupo: </label>
                    <input maxLength={25} disabled={inputsOff} />
                </section>
                <section>
                    <label>responsable: </label>
                    <button disabled={inputsOff} onClick={() => setSeleccResponsable(true)} >
                        Seleccionar...</button>
                </section>
                <section>
                    <label>jornada: </label>
                    <button disabled={inputsOff} onClick={() => setSeleccJornada(true)}
                        >Seleccionar...</button>
                </section>
                <section>
                    <label >número de aprendices: </label>
                    <input maxLength={2} disabled={inputsOff}
                        title='cantidad de estudiantes en el grupo (número de dos dígitos)' />
                </section>
                <section>
                    <label >es cadena de formación: </label>
                    <div className='contRadios'>
                        <label>
                            si<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks' />
                        </label>
                        <label>
                            no<input disabled={inputsOff} type='radio' name='esCadenaFormacionChecks' />
                        </label>
                    </div>
                </section>
            </div>
            {
                seleccResponsable ? <CrudInstructores modoSeleccion={true} 
                onClose={() => setSeleccResponsable(false)}
                responsableSeleccionado={(r) => setResponsable(r)}/> 
                : null
            }
            {
                seleccPrograma ? <CrudPrograma modoSeleccion={true}
                onClose={() => setSeleccPrograma(false)}
                programaSeleccionado={(p) => setPrograma(p)}/>
                :null
            }
            {
                seleccJornada ? <CrudJornadas modoSeleccion={true}
                onClose={() => setSeleccJornada(false)}
                jornadaSeleccionada={(j) => setJornada(j)}/>
                :null
            }
        </ModalGeneral>
    );
}
export default ModalGrupos;