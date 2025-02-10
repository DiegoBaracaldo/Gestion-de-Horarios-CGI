import './LoadingNoStop.css';

const LoadingNoStop = ({texto}) => {

    return(
        <div id='contLoadingNoStop'>
            <div className='modalInternoLoading'>
                <label>{texto}...</label>
                <label className='loader'></label>
            </div>
        </div>
    );
}
export default LoadingNoStop;