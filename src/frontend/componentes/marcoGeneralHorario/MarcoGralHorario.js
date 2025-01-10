import './MarcoGralHorario.css';

const MarcoGralHorario = ({children, titulo}) => {
    return (
        <div id="contMarcoGralHorario">
            <h2 className='titulo'>
                {titulo}
            </h2>
            <div className='hijo'>
                {children}
            </div>
        </div>
    );
}

export default MarcoGralHorario;