class Competencia{
    constructor(id, idPrograma, descripcion, horasRequeridas, fechaRegistro, nombrePrograma){
        this.id = id;
        this.idPrograma = idPrograma;
        this.descripcion = descripcion;
        this.horasRequeridas = horasRequeridas;
        this.fechaRegistro = fechaRegistro;

        //solo para repositorio
        this.nombrePrograma = nombrePrograma;
    }
}
export default Competencia;