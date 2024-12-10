class Grupo{
    constructor(id, idPrograma, idResponsable, codigoGrupo, idJornada,
        cantidadAprendices, esCadenaFormacion, fechaRegistro
    ){
        this.idFicha = id;
        this.idPrograma = idPrograma;
        this.idResponsable = idResponsable;
        this.codigoGrupo = codigoGrupo;
        this.idJornada = idJornada;
        this.cantidadAprendices = cantidadAprendices;
        this.esCadenaFormacion = esCadenaFormacion;
        this.fechaRegistro = fechaRegistro;
    }
}
export default Grupo;