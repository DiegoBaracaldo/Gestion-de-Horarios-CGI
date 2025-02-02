import { useEffect, useRef, useState } from "react";
import MarcoGralHorario from "../../componentes/marcoGeneralHorario/MarcoGralHorario";
import './FusionGrupos.css';
import CrudGrupos from "../crudGrupos/CrudGrupos";
import BotonPositivo from "../../componentes/botonPositivo/BotonPositivo";
import BotonDestructivo from "../../componentes/botonDestructivo/BotonDestructivo";
import { useNavigate } from "react-router-dom";
import ProgramasGrupos from "../../componentes/programasGrupos/ProgramasGrupos";

const FusionGrupos = () => {

    const navegar = useNavigate();

    const [textoHuesped, setTextoHuesped] = useState('');
    const [textoAnfi, setTextoAnfi] = useState('');
    const [grupoHuesped, setGrupoHuesped] = useState({});
    const [grupoAnfi, setGrupoAnfi] = useState({});
    const [abrirGrupos, setAbrirGrupos] = useState(false);
    const seleccionandoHuesped = useRef(false);
    const seleccionandoAnfi = useRef(false);

    useEffect(() => {
        setTextoAnfi(grupoAnfi?.codigoGrupo || '');
        setTextoHuesped(grupoHuesped?.codigoGrupo || '');
    }, [grupoAnfi, grupoHuesped]);

    // useEffect(() => {
    //     console.log(grupoHuesped);
    // }, [grupoHuesped]);

    const ColorBtnHuesped = () => {
        return textoHuesped === '' ? '#385C57' : '#39A900';
    }

    const ColorBtnAnfi = () => {
        return textoAnfi === '' ? '#385C57' : '#39A900';
    }

    const BotonPositivoDisabled = () => {
        return textoAnfi === '' || textoHuesped === '';
    }

    const ClassAnfitrionBtn = () => {
        return textoHuesped === '' ? 'btnOff' : 'btnOn';
    }

    const AbrirGruposHuesped = () => {
        seleccionandoHuesped.current = true;
        setGrupoAnfi({});
        setAbrirGrupos(true);
    }

    const AbrirGruposAnfi = () => {
        seleccionandoAnfi.current = true;
        setAbrirGrupos(true);
    }

    const CerrarGrupos = () => {
        setAbrirGrupos(false);
    }

    const SeleccionandoGrupo = (g) => {
        if (seleccionandoHuesped.current) {
            seleccionandoHuesped.current = false;
            setGrupoHuesped(g);
        } else if (seleccionandoAnfi.current) {
            seleccionandoAnfi.current = false;
            setGrupoAnfi(g);
        }
    }

    return (
        <div id="contExtFusionGrupos">
            <MarcoGralHorario titulo={'fusión de grupos'}>
                {/* <div className="contInternoFusionGrupos">
                    <div className="contGrupoHuesped">
                        <label>grupo huesped:</label>
                        <input type="text" value={textoHuesped} disabled />
                        <button style={{ backgroundColor: ColorBtnHuesped() }}
                            onClick={AbrirGruposHuesped}>
                            seleccionar
                        </button>
                    </div>
                    <div className="contGrupoAnfitrion">
                        <label>grupo anfitrión:</label>
                        <input type="text" value={textoAnfi} disabled />
                        <button style={{ backgroundColor: ColorBtnAnfi() }}
                            onClick={AbrirGruposAnfi}
                            className={ClassAnfitrionBtn()}>
                            seleccionar
                        </button>
                    </div>
                </div> */}
                <ProgramasGrupos />
            </MarcoGralHorario>
            <div className="contBotones">
                <div>
                    <BotonPositivo
                        texto={'fusionar'}
                        disabledProp={BotonPositivoDisabled()} />
                </div>
                <div>
                    <BotonDestructivo
                        texto={'cancelar'}
                        onClick={() => navegar(-1)} />
                </div>
            </div>
            {
                abrirGrupos ?
                    <CrudGrupos
                        modoSeleccion={true}
                        onCloseCrud={CerrarGrupos}
                        grupoSeleccionado={(g) => SeleccionandoGrupo(g)}
                        idProgramaHuesped={seleccionandoAnfi.current ? grupoHuesped.idPrograma : null}
                        idHuesped={seleccionandoAnfi.current ? grupoHuesped.id : null} />
                    : null
            }
        </div>
    );
}

export default FusionGrupos;