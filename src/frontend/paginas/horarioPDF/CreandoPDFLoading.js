import './CreandoPDFLoading.css';

const CreandoPDFLoading = () => {

    return(
        <div id='contCreandoPDFLoading'>
            <div className='modalInternoCreandoPDF'>
                <label>Creando archivos PDF...</label>
                <label className='loader'></label>
            </div>
        </div>
    );
}
export default CreandoPDFLoading;